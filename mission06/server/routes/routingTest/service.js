import Task from '../../models/Task.js'

const testMessage = async (req, res) => {
    res.send("안녕하세요.");
}

const findDataByDatabase = async (req, res) => {
    try{
        console.log("데이터 찾기 시작");
        const sort = req.query.sort;
        const count = Number(req.query.count) || 0;
    
        const sortOption = {
            createdAt: sort === 'oldest' ? 'asc' : 'desc',
        };
    
        const tasks = await Task.find().sort(sortOption).limit(count);
        if(tasks) res.send(tasks);
        else res.status(404).send({ message: "데이터를 찾을 수 없습니다."});
    } catch(err) {
        console.log(err);
    }
}

const service = {
    testMessage,
    findDataByDatabase,
}

export default service;