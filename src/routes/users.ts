import { db } from '../db/index.js';
import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import express from "express"

const router = express.Router();

// Reference the actual "users" table as created by Better Auth in Neon
const users = pgTable("users", {
  id: text("id"),
  name: text("name"),
  email: text("email"),
  role: text("role"),
  createdAt: timestamp("created_at"),
});

// Get all users with optional search and pagination

router.get("/", async (req, res) => {
  const { search, role, page = 1, limit = 10 } = req.query;

  const currentPage = Math.max(1, Number(page));
  const limitPerPage = Math.min(100, Math.max(1, Number(limit)));

  const offset = (currentPage - 1) * limitPerPage;

  const filterCondition = [];

  try {

    // If search query exists, filter by user name OR user email

    if (search) {
      filterCondition.push(
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );
    }

    // If role filter exists, match role exactly

    if (role) {
      filterCondition.push(eq(users.role, role as string));
    }

    // Combine all filters using AND if any exist

    const whereClause = filterCondition.length > 0 ? and(...filterCondition) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const usersList = await db
      .select({ ...getTableColumns(users) })
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: usersList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage)
      }
    });

  } catch (e) {
    console.error(`GET /users error: ${e}`);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

export default router;