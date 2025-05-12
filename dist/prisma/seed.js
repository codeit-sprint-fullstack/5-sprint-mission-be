"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // 유저 생성
        yield Promise.all([
            prisma.user.create({ data: { "id": "eba666a4-7862-4bc3-b674-d5345bbc2d85", "nickname": "유저1", "email": "user1@example.com", "encryptedPassword": "hashedpassword" } }),
            prisma.user.create({ data: { "id": "d08d5cb3-6eab-4f40-b4be-0035bbdbc968", "nickname": "유저2", "email": "user2@example.com", "encryptedPassword": "hashedpassword" } }),
            prisma.user.create({ data: { "id": "bf6e2cca-0607-4650-a518-dae2698b2587", "nickname": "유저3", "email": "user3@example.com", "encryptedPassword": "hashedpassword" } }),
            prisma.user.create({ data: { "id": "48a8067d-191f-4f77-b0be-d5e47cb11745", "nickname": "유저4", "email": "user4@example.com", "encryptedPassword": "hashedpassword" } }),
            prisma.user.create({ data: { "id": "e310b0be-d2bb-4a37-bd0b-77366c842dbc", "nickname": "유저5", "email": "user5@example.com", "encryptedPassword": "hashedpassword" } })
        ]);
        // 상품 생성
        yield prisma.product.createMany({
            data: [
                {
                    "id": "595817f0-f47b-4426-9977-ebe19b9ce5dd",
                    "userId": "48a8067d-191f-4f77-b0be-d5e47cb11745",
                    "name": "animi 상품 1",
                    "description": "Doloribus soluta et ab ullam.",
                    "price": 294188,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-19T06:39:48Z",
                    "updatedAt": "2025-03-18T06:39:48Z"
                },
                {
                    "id": "a548291e-b409-4e3f-a6ba-e06b3d21172a",
                    "userId": "eba666a4-7862-4bc3-b674-d5345bbc2d85",
                    "name": "natus 상품 2",
                    "description": "Dicta assumenda ratione reprehenderit reiciendis id delectus.",
                    "price": 842556,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-17T06:39:48Z",
                    "updatedAt": "2025-04-15T06:39:48Z"
                },
                {
                    "id": "7d89ce32-925e-4f94-ad6c-2f0d0419bd82",
                    "userId": "e310b0be-d2bb-4a37-bd0b-77366c842dbc",
                    "name": "sequi 상품 3",
                    "description": "Labore perferendis officiis.",
                    "price": 748063,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-12T06:39:48Z",
                    "updatedAt": "2025-04-04T06:39:48Z"
                },
                {
                    "id": "b7676137-dda5-4df4-b84e-875896d699a8",
                    "userId": "bf6e2cca-0607-4650-a518-dae2698b2587",
                    "name": "numquam 상품 4",
                    "description": "A itaque autem excepturi facilis ab quam.",
                    "price": 330762,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-02-23T06:39:48Z",
                    "updatedAt": "2025-03-06T06:39:48Z"
                },
                {
                    "id": "bdb80b2b-c839-416d-9c58-2f2b37a354f1",
                    "userId": "e310b0be-d2bb-4a37-bd0b-77366c842dbc",
                    "name": "culpa 상품 5",
                    "description": "Ipsum nostrum non id perspiciatis consectetur accusantium.",
                    "price": 184561,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-09T06:39:48Z",
                    "updatedAt": "2025-03-11T06:39:48Z"
                },
                {
                    "id": "c2d9f0c9-8fd0-4807-9c79-dc5c44c60596",
                    "userId": "48a8067d-191f-4f77-b0be-d5e47cb11745",
                    "name": "consequatur 상품 6",
                    "description": "Voluptatibus rem iste cum.",
                    "price": 954108,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-04T06:39:48Z",
                    "updatedAt": "2025-04-05T06:39:48Z"
                },
                {
                    "id": "d21ea7aa-ed29-4af0-85dc-c2a4a0f8a6e2",
                    "userId": "d08d5cb3-6eab-4f40-b4be-0035bbdbc968",
                    "name": "provident 상품 7",
                    "description": "In atque animi aut dicta maiores.",
                    "price": 139498,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-26T06:39:48Z",
                    "updatedAt": "2025-04-03T06:39:48Z"
                },
                {
                    "id": "4b076be7-169e-4dd4-b4d7-323540f721e3",
                    "userId": "d08d5cb3-6eab-4f40-b4be-0035bbdbc968",
                    "name": "veniam 상품 8",
                    "description": "Dolor laboriosam quasi fugiat.",
                    "price": 337926,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-02T06:39:48Z",
                    "updatedAt": "2025-03-29T06:39:48Z"
                },
                {
                    "id": "e492b593-8147-448c-b97f-3eb654ff3b63",
                    "userId": "48a8067d-191f-4f77-b0be-d5e47cb11745",
                    "name": "nobis 상품 9",
                    "description": "Quaerat voluptatibus fugiat.",
                    "price": 514061,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-12T06:39:48Z",
                    "updatedAt": "2025-04-20T06:39:48Z"
                },
                {
                    "id": "0aace0a6-bb7c-40ce-9360-bb4209c66723",
                    "userId": "e310b0be-d2bb-4a37-bd0b-77366c842dbc",
                    "name": "facilis 상품 10",
                    "description": "Occaecati tempora labore repudiandae quisquam ipsam illo et.",
                    "price": 667075,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-14T06:39:48Z",
                    "updatedAt": "2025-04-06T06:39:48Z"
                },
                {
                    "id": "2a9f6d95-3018-4f57-a490-bdcb9e337717",
                    "userId": "48a8067d-191f-4f77-b0be-d5e47cb11745",
                    "name": "sit 상품 11",
                    "description": "Cum nulla harum quaerat nulla doloribus.",
                    "price": 763565,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-02-20T06:39:48Z",
                    "updatedAt": "2025-03-01T06:39:48Z"
                },
                {
                    "id": "6c59ef3d-a2f3-4915-8abe-0a103ac8f9d1",
                    "userId": "e310b0be-d2bb-4a37-bd0b-77366c842dbc",
                    "name": "rerum 상품 12",
                    "description": "Sapiente temporibus facere mollitia.",
                    "price": 643887,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-25T06:39:48Z",
                    "updatedAt": "2025-03-05T06:39:48Z"
                },
                {
                    "id": "01d4c87d-b0ae-4ae8-bba6-ef3c08bc4d6f",
                    "userId": "bf6e2cca-0607-4650-a518-dae2698b2587",
                    "name": "magnam 상품 13",
                    "description": "Cupiditate animi quas animi similique similique eveniet.",
                    "price": 609333,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-18T06:39:48Z",
                    "updatedAt": "2025-03-20T06:39:48Z"
                },
                {
                    "id": "cfdc7f53-695d-4438-bc69-699c222d2daa",
                    "userId": "48a8067d-191f-4f77-b0be-d5e47cb11745",
                    "name": "officia 상품 14",
                    "description": "Tempore praesentium incidunt corporis qui.",
                    "price": 24452,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-25T06:39:48Z",
                    "updatedAt": "2025-03-20T06:39:48Z"
                },
                {
                    "id": "4e917c50-9174-4e37-a51d-adfa6197bfc6",
                    "userId": "e310b0be-d2bb-4a37-bd0b-77366c842dbc",
                    "name": "eaque 상품 15",
                    "description": "Iusto sint hic inventore qui harum minima.",
                    "price": 78698,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-09T06:39:48Z",
                    "updatedAt": "2025-02-28T06:39:48Z"
                },
                {
                    "id": "fa566b68-e668-4682-9f44-bcf12bff93d6",
                    "userId": "eba666a4-7862-4bc3-b674-d5345bbc2d85",
                    "name": "maiores 상품 16",
                    "description": "Illo recusandae odio repellat hic eius voluptatem ea.",
                    "price": 746139,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-02-27T06:39:48Z",
                    "updatedAt": "2025-02-24T06:39:48Z"
                },
                {
                    "id": "446b874e-046e-449b-9673-85086d23fbf2",
                    "userId": "d08d5cb3-6eab-4f40-b4be-0035bbdbc968",
                    "name": "error 상품 17",
                    "description": "Possimus non tempore consequatur deleniti.",
                    "price": 632643,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-17T06:39:48Z",
                    "updatedAt": "2025-03-12T06:39:48Z"
                },
                {
                    "id": "9a251af6-4923-40a6-92d2-427fe1b7f206",
                    "userId": "48a8067d-191f-4f77-b0be-d5e47cb11745",
                    "name": "rerum 상품 18",
                    "description": "Dicta voluptatibus quis ipsam alias est.",
                    "price": 404576,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-20T06:39:48Z",
                    "updatedAt": "2025-04-07T06:39:48Z"
                },
                {
                    "id": "1f096d24-8fca-4cbe-b40d-a36bb88afdee",
                    "userId": "d08d5cb3-6eab-4f40-b4be-0035bbdbc968",
                    "name": "libero 상품 19",
                    "description": "Eaque pariatur eius.",
                    "price": 342549,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-04T06:39:48Z",
                    "updatedAt": "2025-03-20T06:39:48Z"
                },
                {
                    "id": "4e1f330a-1c90-42b5-b1c9-2b8909fa4ec9",
                    "userId": "d08d5cb3-6eab-4f40-b4be-0035bbdbc968",
                    "name": "soluta 상품 20",
                    "description": "Tempore deleniti a animi nulla odit.",
                    "price": 643410,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-10T06:39:48Z",
                    "updatedAt": "2025-03-16T06:39:48Z"
                },
                {
                    "id": "842a95b1-17e4-4911-b452-c6a9245f6b0c",
                    "userId": "eba666a4-7862-4bc3-b674-d5345bbc2d85",
                    "name": "laborum 상품 21",
                    "description": "Qui autem quidem.",
                    "price": 890478,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-13T06:39:48Z",
                    "updatedAt": "2025-04-12T06:39:48Z"
                },
                {
                    "id": "f66d1b70-5057-45f1-8255-02804b72096d",
                    "userId": "eba666a4-7862-4bc3-b674-d5345bbc2d85",
                    "name": "laboriosam 상품 22",
                    "description": "Laudantium praesentium impedit eum.",
                    "price": 869898,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-12T06:39:48Z",
                    "updatedAt": "2025-03-01T06:39:48Z"
                },
                {
                    "id": "e57c1f9c-68b8-4262-a83d-a169f7ab30e7",
                    "userId": "eba666a4-7862-4bc3-b674-d5345bbc2d85",
                    "name": "cumque 상품 23",
                    "description": "Incidunt veniam voluptates doloremque.",
                    "price": 293669,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-05T06:39:48Z",
                    "updatedAt": "2025-04-08T06:39:48Z"
                },
                {
                    "id": "50cee8c5-8599-4ff8-8a1c-f62b76fe5f9a",
                    "userId": "d08d5cb3-6eab-4f40-b4be-0035bbdbc968",
                    "name": "eius 상품 24",
                    "description": "Tempore aut ipsam dicta enim expedita sit.",
                    "price": 352973,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-18T06:39:48Z",
                    "updatedAt": "2025-03-06T06:39:48Z"
                },
                {
                    "id": "ee98541d-809a-4e98-9126-6b4fff0870bf",
                    "userId": "eba666a4-7862-4bc3-b674-d5345bbc2d85",
                    "name": "a 상품 25",
                    "description": "Tempore corporis perspiciatis numquam a soluta.",
                    "price": 860930,
                    "tags": [
                        "태그1",
                        "태그2"
                    ],
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-05T06:39:48Z",
                    "updatedAt": "2025-03-08T06:39:48Z"
                }
            ]
        });
        // 게시글 생성
        yield prisma.article.createMany({
            data: [
                {
                    "id": "3141955f-4b8d-4505-b6e3-e8283c52c70e",
                    "userId": "eba666a4-7862-4bc3-b674-d5345bbc2d85",
                    "title": "게시글 제목 1",
                    "content": "Explicabo sed tempore doloribus deserunt.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-24T06:39:48Z",
                    "updatedAt": "2025-03-19T06:39:48Z"
                },
                {
                    "id": "b4ebc06a-a757-450e-8859-b6a24128ec11",
                    "userId": "eba666a4-7862-4bc3-b674-d5345bbc2d85",
                    "title": "게시글 제목 2",
                    "content": "Tempore quae porro iusto autem aliquam. Voluptate quibusdam harum expedita dolorum. Ab nobis facilis expedita amet ipsum.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-12T06:39:48Z",
                    "updatedAt": "2025-03-16T06:39:48Z"
                },
                {
                    "id": "1c3f2dcf-e218-4738-88b1-cd0b975f0959",
                    "userId": "e310b0be-d2bb-4a37-bd0b-77366c842dbc",
                    "title": "게시글 제목 3",
                    "content": "Veritatis ad fuga quaerat magni. Ullam rerum quibusdam doloribus quisquam iure facilis. Deleniti ipsam amet.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-04T06:39:48Z",
                    "updatedAt": "2025-03-22T06:39:48Z"
                },
                {
                    "id": "fdb5802d-7efd-410e-bfeb-bf5a7b3f82b0",
                    "userId": "eba666a4-7862-4bc3-b674-d5345bbc2d85",
                    "title": "게시글 제목 4",
                    "content": "Eligendi atque asperiores dicta eveniet. Accusantium saepe illo ullam.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-29T06:39:48Z",
                    "updatedAt": "2025-04-17T06:39:48Z"
                },
                {
                    "id": "b0caa3d1-1508-4193-b821-20985dd0553d",
                    "userId": "e310b0be-d2bb-4a37-bd0b-77366c842dbc",
                    "title": "게시글 제목 5",
                    "content": "Corporis magni iusto modi ipsam quia. Rem delectus occaecati magnam culpa. Quam officia repellat asperiores optio ut quaerat.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-10T06:39:48Z",
                    "updatedAt": "2025-03-03T06:39:48Z"
                },
                {
                    "id": "15d201e4-a232-4080-b74f-40dac00313fb",
                    "userId": "bf6e2cca-0607-4650-a518-dae2698b2587",
                    "title": "게시글 제목 6",
                    "content": "Harum cum quos natus quasi possimus tenetur. Possimus magni dolorum pariatur.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-08T06:39:48Z",
                    "updatedAt": "2025-03-14T06:39:48Z"
                },
                {
                    "id": "293d4988-52f0-425f-bfd5-2316849e928b",
                    "userId": "bf6e2cca-0607-4650-a518-dae2698b2587",
                    "title": "게시글 제목 7",
                    "content": "Quos accusamus neque quod. Eum ratione suscipit praesentium error quae iste eveniet.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-02T06:39:48Z",
                    "updatedAt": "2025-03-13T06:39:48Z"
                },
                {
                    "id": "c1329af0-29e3-4cb9-b461-2bc86a485091",
                    "userId": "eba666a4-7862-4bc3-b674-d5345bbc2d85",
                    "title": "게시글 제목 8",
                    "content": "Nam nesciunt dolore commodi recusandae explicabo. Aspernatur sit inventore tenetur maxime. Aliquam iure ipsum ea dicta et consectetur. Dolorum animi cupiditate quo natus incidunt ipsum.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-11T06:39:48Z",
                    "updatedAt": "2025-03-30T06:39:48Z"
                },
                {
                    "id": "f29cca27-a74a-4c0b-bc7a-3b23ee01da3c",
                    "userId": "48a8067d-191f-4f77-b0be-d5e47cb11745",
                    "title": "게시글 제목 9",
                    "content": "Tempora amet reprehenderit adipisci architecto sunt assumenda. Nostrum doloribus eaque eos minima dolorum. Rem reiciendis ipsam nostrum.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-02-23T06:39:48Z",
                    "updatedAt": "2025-04-06T06:39:48Z"
                },
                {
                    "id": "051b6bea-d894-483d-8c18-81860a170114",
                    "userId": "e310b0be-d2bb-4a37-bd0b-77366c842dbc",
                    "title": "게시글 제목 10",
                    "content": "Ipsa quibusdam itaque adipisci architecto vitae vel. Vel iste fugiat porro.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-06T06:39:48Z",
                    "updatedAt": "2025-03-15T06:39:48Z"
                },
                {
                    "id": "7c012b74-2dee-4a49-9a61-d0f01e13af2a",
                    "userId": "bf6e2cca-0607-4650-a518-dae2698b2587",
                    "title": "게시글 제목 11",
                    "content": "Aliquid alias mollitia eveniet ab impedit. Impedit itaque veniam qui optio. Soluta ipsam repellendus. Dolore dolor ipsam assumenda.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-22T06:39:48Z",
                    "updatedAt": "2025-03-25T06:39:48Z"
                },
                {
                    "id": "13d19c8c-5a59-4fb6-b879-4ae1967f6e15",
                    "userId": "d08d5cb3-6eab-4f40-b4be-0035bbdbc968",
                    "title": "게시글 제목 12",
                    "content": "Commodi fugiat minus voluptatibus quia deleniti porro sequi. Veniam architecto ullam impedit ad laboriosam natus.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-02-26T06:39:48Z",
                    "updatedAt": "2025-02-24T06:39:48Z"
                },
                {
                    "id": "552de36d-7907-4723-9e21-c9087e2473ff",
                    "userId": "bf6e2cca-0607-4650-a518-dae2698b2587",
                    "title": "게시글 제목 13",
                    "content": "Illum dolore quasi ullam. Possimus voluptatibus fugit cum. Dolorum repellendus harum.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-01T06:39:48Z",
                    "updatedAt": "2025-03-14T06:39:48Z"
                },
                {
                    "id": "dbb14d38-4623-4b87-88b6-7ababdff900a",
                    "userId": "d08d5cb3-6eab-4f40-b4be-0035bbdbc968",
                    "title": "게시글 제목 14",
                    "content": "Molestias consequuntur cum ducimus. Eius exercitationem ducimus nesciunt temporibus iusto dicta.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-02-23T06:39:48Z",
                    "updatedAt": "2025-04-04T06:39:48Z"
                },
                {
                    "id": "6d59e584-4f49-4997-80ef-50d82b49cdc8",
                    "userId": "bf6e2cca-0607-4650-a518-dae2698b2587",
                    "title": "게시글 제목 15",
                    "content": "Placeat libero alias blanditiis nemo nesciunt doloremque. Consectetur corporis dolores itaque atque expedita.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-16T06:39:48Z",
                    "updatedAt": "2025-02-22T06:39:48Z"
                },
                {
                    "id": "d48d6b65-3283-4522-a36b-40e832ef9605",
                    "userId": "e310b0be-d2bb-4a37-bd0b-77366c842dbc",
                    "title": "게시글 제목 16",
                    "content": "Aperiam exercitationem vitae iste. Similique id est id animi facere. Pariatur animi excepturi eaque exercitationem ex sequi tempora.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-27T06:39:48Z",
                    "updatedAt": "2025-03-23T06:39:48Z"
                },
                {
                    "id": "c91acae6-cf8d-4680-bf1c-4c1999cc8c1a",
                    "userId": "eba666a4-7862-4bc3-b674-d5345bbc2d85",
                    "title": "게시글 제목 17",
                    "content": "Sit illo occaecati corporis nobis. Laudantium saepe quia perspiciatis ipsa. Eligendi praesentium porro at aut odio.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-06T06:39:48Z",
                    "updatedAt": "2025-02-22T06:39:48Z"
                },
                {
                    "id": "77d3f3d9-0993-4229-b30f-af3232aea22d",
                    "userId": "e310b0be-d2bb-4a37-bd0b-77366c842dbc",
                    "title": "게시글 제목 18",
                    "content": "Placeat nisi alias perferendis in sed. Dolores fugiat est doloribus tempora.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-15T06:39:48Z",
                    "updatedAt": "2025-04-16T06:39:48Z"
                },
                {
                    "id": "9a22c28c-a103-419a-8f2f-2ffd32818298",
                    "userId": "bf6e2cca-0607-4650-a518-dae2698b2587",
                    "title": "게시글 제목 19",
                    "content": "Quas autem cumque. Quod nihil atque. Explicabo dolorem odio placeat recusandae nihil voluptatum.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-09T06:39:48Z",
                    "updatedAt": "2025-03-15T06:39:48Z"
                },
                {
                    "id": "1cdfcff6-3924-454d-8105-3e1902729d88",
                    "userId": "e310b0be-d2bb-4a37-bd0b-77366c842dbc",
                    "title": "게시글 제목 20",
                    "content": "Ab nesciunt enim necessitatibus aperiam eius. Quidem dolorem odit earum. Maxime assumenda voluptatibus eligendi aperiam ipsa nobis autem.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-02-20T06:39:48Z",
                    "updatedAt": "2025-03-02T06:39:48Z"
                },
                {
                    "id": "f7d8a972-fa3b-4eec-a899-725977f18812",
                    "userId": "e310b0be-d2bb-4a37-bd0b-77366c842dbc",
                    "title": "게시글 제목 21",
                    "content": "Id beatae expedita. Praesentium veritatis officia quod magnam odio. Sed blanditiis laboriosam dicta laudantium est.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-02-28T06:39:48Z",
                    "updatedAt": "2025-03-04T06:39:48Z"
                },
                {
                    "id": "8f7b5d5a-9921-462b-9e10-c884f1a4c81c",
                    "userId": "bf6e2cca-0607-4650-a518-dae2698b2587",
                    "title": "게시글 제목 22",
                    "content": "Labore asperiores quibusdam. Debitis quas molestias. Porro vero placeat.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-10T06:39:48Z",
                    "updatedAt": "2025-03-02T06:39:48Z"
                },
                {
                    "id": "bacf99db-275f-4913-9427-b9a47deea08d",
                    "userId": "eba666a4-7862-4bc3-b674-d5345bbc2d85",
                    "title": "게시글 제목 23",
                    "content": "Alias vero consectetur quidem et sint. Eum reiciendis expedita ipsam quae facere est.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-03-15T06:39:48Z",
                    "updatedAt": "2025-02-28T06:39:48Z"
                },
                {
                    "id": "a7fbd492-cd9f-4719-a616-683f6051ea73",
                    "userId": "48a8067d-191f-4f77-b0be-d5e47cb11745",
                    "title": "게시글 제목 24",
                    "content": "Magnam libero ea qui placeat. Et provident nihil blanditiis impedit.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-14T06:39:48Z",
                    "updatedAt": "2025-03-06T06:39:48Z"
                },
                {
                    "id": "ff51acf1-6375-4ce1-a940-3f5661f9e2a0",
                    "userId": "d08d5cb3-6eab-4f40-b4be-0035bbdbc968",
                    "title": "게시글 제목 25",
                    "content": "Ut placeat cum nulla ad autem. Saepe nemo consequatur.",
                    "imageUrls": [
                        "https://via.placeholder.com/300"
                    ],
                    "createdAt": "2025-04-07T06:39:48Z",
                    "updatedAt": "2025-04-11T06:39:48Z"
                }
            ]
        });
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
