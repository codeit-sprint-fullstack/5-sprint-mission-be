import prisma from "../../prismaClient.js";
import { assert } from "superstruct";
import { CreateProduct, PatchProduct } from "../../structs.js";

// 상품  리스트 조회
const getProductList = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, order = 'newest', keyword = '' } = req.query;
        let orderOption;
        switch (order) {
            case "newest" :
                orderOption = { createdAt: 'desc' };
                break;
        }

        const totalCount = await prisma.product.findMany({
            where: {
                OR: [
                    { name: {
                        contains: keyword,
                    } },
                    { description: {
                        contains: keyword,
                    } },
                ]
            },
        });

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: {
                        contains: keyword,
                    } },
                    { description: {
                        contains: keyword,
                    } },
                ]
            },
            orderBy: orderOption,
            skip: (Number(page)-1)*Number(pageSize),
            take: Number(pageSize),
        })
        res.status(200).send([{totalCount: totalCount.length, list: products}]);
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: '예기치 못한 오류 발생!' });
      }
}

// 상품 등록
const postProduct = async (req, res) => {
    try {
        assert(req.body, CreateProduct);
    } catch (err) {
        res.status(400).send({message: "유효성 검사를 통과하지 못했습니다."});
    }
    try {
        const newProduct = await prisma.product.create({
            data: req.body,
        })
        res.send(newProduct);
    } catch (err) {
        console.log(err)
        res.status(500).send({message: "예기치 못한 오류 발생!"});
    }
}

// 상품 단일 조회
const getProduct = async (req, res) => {
    try{
        const id = req.params.id;
        const product = await prisma.product.findUnique({
            where: {
                id: id,
            }
        })
        res.send(product);
    } catch (err) {
        res.status(500).send({message: "예기치 못한 오류 발생!"});
    }
}

// 상품 업데이트
const patchProduct = async (req, res) => {
    try {
        assert(req.body, PatchProduct)
    } catch (err) {
        res.status(400).send({message: "유효성 검사를 통과하지 못했습니다."})
    }
    try {
        const id = req.params.id;
        try {
            const newProduct = await prisma.product.update({
                where: {
                  id : id,  
                },
                data: req.body,
            })
            res.send(newProduct);
        } catch (err) {
            res.status(400).send({ message: '올바른 id값을 입력하세요.' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({message: "예기치 못한 오류 발생!"});
    }
}

// 상품 제거
const deleteProduct = async (req, res) => {
    try{
        const id = req.params.id;
        const product = await prisma.product.delete({
            where: {
                id: id,
            }
        })
        res.status(200).send({message: "삭제 완료"});
    } catch (err) {
        res.status(500).send({message: "예기치 못한 오류 발생!"});
    }
}
  
  
const service = {
    getProductList,
    postProduct,
    getProduct,
    patchProduct,
    deleteProduct,
}
  export default service;


  // app.get("/users", async (req, res) => {
//     // 유저 목록 조회
//     const users = await prisma.user.findMany({});
//     res.send(users);
//   });

// app.get("")
  
//   app.get("/users/:id", async (req, res) => {
//     const { id } = req.params;
//     // id에 해당하는 유저 조회
//     const user = await prisma.user.findUnique({
//       where : {
//         id : id,
//       }
//     })
//     res.send(user);
//   });
  
//   app.post("/users", async (req, res) => {
//     // 리퀘스트 바디 내용으로 유저 생성
//     const { email, address, name,age } =req.body;
//     const createdUser = await prisma.user.create({
//       data : {
//         age,
//         name,
//         email,
//         address
//       }
//     })
//     res.status(201).send(createdUser);
//   });
  
//   app.patch("/users/:id", async (req, res) => {
//     const { id } = req.params;
//     const { name } = req.body;
//     //update 는 고유키(pk)로만 가능.
//     const user = await prisma.user.update({
//       data: {
//         name,
//       },
//       where: {
//         id,
//       },
//     })
//     // 리퀘스트 바디 내용으로 id에 해당하는 유저 수정
//     res.send(user);
//   });
  
//   app.delete("/users/:id", async (req, res) => {
//     const { id } = req.params;
//     const deletedUser = await prisma.user.delete({
//       where: {
//         id,
//       }
//     })
//     // id에 해당하는 유저 삭제
//     res.sendStatus(204);
//   });
  
//   const port = process.env.PORT || 5004;
  
//   app.listen(port, () => console.log(`Server Started :${port}`));
  
//   //유저 주문 목록과 유저의 나이
//   app.get("/users/order/age/:age", async (req, res) => {
//     const { age } = req.params;
//     const result = await prisma.user.findMany({
//       where : {
//         age: Number(age),
//       },
//       include: {
//         orders: true,
//       },
//     })
//     res.send(result);
//   });

//   //트랜잭션
//   app.post("/users/trans", async (req, res) => {
//     await prisma.$transaction(async (prisma) => {
//       // 1 유저 생성
//       await prisma.user.create({
//         data: {
//           age: 20,
//           email: "몰라몰라이메일",
//           name: "이름이다~~",
//         },
//       });
  
//       // 2 유저 설정 생성
//       await prisma.userPreference.create({
//         data: {
//           receiveEmail: true,
//         },
//       });
  
//       // 3 주문 업데이트
//       await prisma.order.update({
//         where: {
//           id: "abcdefg",
//         },
//       });
//     });
//   });