import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as z from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createProjectSchema } from '@/lib/validations/project';
import { db } from '@/lib/db';

export async function DELETE(req: NextRequest) {
  try {
    // Assuming the user ID is sent in the request body or as a query parameter
    const { userId } = await req.json();

    // Delete user data and associated project data
    await db.$transaction(async (db) => {
      // Delete user data
      await db.user.delete({
        where: {
          id: userId,
        },
      });

      // Delete associated project data
      await db.project.deleteMany({
        where: {
          userId: userId,
        },
      });
      
      // Delete associated Markdown data (if any)
      await db.markdownFile.deleteMany({
        where: {
          authorId: userId,
        },
      });
    });

    // Redirect the user to the Docify GitHub app configure page for further account deletion
    const appId = process.env.GITHUB_APP_ID;
    const installationUrl = `https://github.com/apps/docify-wiki/installations/new?target_id=${appId}&target_type=app`;
    return NextResponse.redirect(installationUrl);
  } catch (error) {
    console.error('Error deleting user account:', error);
    return NextResponse.json({
      message: 'Failed to delete user account',
      success: false,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { url, repository_name, userId, testing_dir, project_type } =
      createProjectSchema.parse(data);

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            'User corresponding to the userId not found, unauthorized access',
          success: false,
        },
        { status: 401 }
      );
    }

    // Construct URL to the README.md file
    const readmeUrl = `https://api.github.com/repos/${user.github_username}/${repository_name}/readme`;

    // Fetch the content of the README.md file
    const response = await axios.get(readmeUrl, {
      headers: {
        Authorization: `token ${user.github_access_token}`,
      },
    }).catch((error) => {
      console.log('Error: Readme does not exist');
      return {
        data: {
          content: '',
        },
      };
    });

    const project = await db.$transaction(async (db) => {
      const _project = await db.project.create({
        data: {
          url: url,
          repository_name: repository_name,
          userId: userId,
          testing_dir: testing_dir,
          project_type: project_type,
        },
      });

      const responseData = response.data;

      // Extract the Markdown content from the JSON response
      const readmeContent = responseData.content;
      const decoded_base64 = Buffer.from(readmeContent, 'base64').toString(
        'utf-8'
      );

      // Create an entry for the MarkdownFile
      await db.markdownFile.create({
        data: {
          content: decoded_base64,
          authorId: userId,
          projectId: _project.projectId, // Assuming project.id is the primary key of the newly created project
        },
      });
    });

    return NextResponse.json({
      project: project,
      message: 'Project created successfully',
      success: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        message: 'Project creation failed ' + error.issues[0].message,
        success: false,
      });
    }

    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json({
        message: 'Project creation failed ' + (error?.message || ''),
        success: false,
      });
    }

    return NextResponse.json({
      message: 'Project creation failed ' + (error || ''),
      success: false,
    });
  }
}