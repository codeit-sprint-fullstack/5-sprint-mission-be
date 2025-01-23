import asyncHandler from "../asyncHandler.js";
import { assert } from "superstruct";
import { CreateUser, PatchUser } from "../../structs.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserList = asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, order = "newest" } = req.query;
  let orderBy;
  switch (order) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
  }
  const users = await prisma.user.findMany({
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
    include: {
      userPreference: {
        select: {
          receiveEmail: true,
        },
      },
    },
  });
  res.send(users);
});

export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      userPreference: true,
    },
  });
  res.send(user);
});

export const createUser = asyncHandler(async (req, res) => {
  assert(req.body, CreateUser);
  const user = await prisma.user.create({
    data: req.body,
  });
  res.status(201).send(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  assert(req.body, PatchUser);
  const { id } = req.params;
  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  });
  res.send(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id },
  });
  res.sendStatus(204);
});

export const getSavedProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { savedProducts } = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      savedProducts: true,
    },
  });
  res.send(savedProducts);
});
