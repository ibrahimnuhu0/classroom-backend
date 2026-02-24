import { db } from '../db/';
import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import { departments, subjects } from './../db/schema/app';
import express from "express"

const router = express.Router();

// Get all subject with optiinal search and pagination

router.get("/", async (req, res) => {
  const {search, department, page = 1, limit = 10} = req.query;

  const currentPage = Math.max(1, Number(page))
  const limitPerPage = Math.min(100, Math.max(1, Number(limit)))

  const offset = (currentPage -1) * limitPerPage;

  const filterCondition = [];



  try {

    //if search query  exists, filter by subject name OR subject code

  if (search)  {
    filterCondition.push(
      or(
           ilike(subjects.name, `%${search}%`),
           ilike(subjects.code, `%${search}%`)
      )
    )
  }

// If departments filter exists , match department name

if (department) {
  filterCondition.push(ilike(departments.name, `%${department}%`))
}

// Combine all filters using  AND if any exist

    const  whereClause = filterCondition.length > 0 ? and(...filterCondition) : undefined

    const countResult = await db
        .select({count: sql<number>`count(*)`})
        .from(subjects)
        .leftJoin(departments, eq(subjects.departmentId, departments.id))
        .where(whereClause)

    const totalCount =  countResult [0] ?.count ?? 0;
    const subjectsList =  await db.select({...getTableColumns(subjects),
       department: {...getTableColumns(departments)}
  }).from(subjects).leftJoin(departments, eq(subjects.departmentId, departments.id))
     .where(whereClause).
     orderBy(desc(subjects.createdAt))
     .limit(limitPerPage)
     .offset(offset);

    res.status(200).json({
      data: subjectsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage)
      }
    }) 


  }catch (e) {
    console.error(`GET /subjects error: ${e}`);
    res.status(500).json({error: 'Failed to get subjects'})
  }
})

export default router;