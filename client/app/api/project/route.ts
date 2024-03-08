import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db';
import * as z from 'zod';
import prisma from 'prisma'

// pages/api/projects.js

const createProjectSchema = z.object({
    url: z.string(),
    userId: z.string(),
    testing_dir: z.string(),
});

export async function POST(req: NextRequest) 
{
    try {
        const data = await req.json();
        const { url, userId, testing_dir } = createProjectSchema.parse(data);
    
      const project = await db.project.create({
        data: {
          url: url,
          userId : userId,
          testing_dir : testing_dir,
        },
      });
      return NextResponse.json({
        project:project,
        message: 'Project created successfully',
        success: true,
      });

    } catch (error) {
      console.error(error);
      if(error instanceof z.ZodError){
        return NextResponse.json({
            message: 'Project creation failed ' + (error.issues[0].message),
            success:false,
        });
      }

      if(error instanceof prisma.PrismaClientKnownRequestError){
        return NextResponse.json({
            message: 'Project creation failed ' + (error?.message || ""),
            success: false,
        });
    }

        return NextResponse.json({
            message: 'Project creation failed ' + (error?.message || ""),
            success: false,
        });
    }
}