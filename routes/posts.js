//express에서 request
//param = parameter. req.params = req객체에 parameter라는 프로퍼티
//express는 가장 인기있는 node 웹 프레임워크(=특정 프로그램 개발을 위한 규칙을 제공하는 프로그램)
const express = require('express');
const router = express.Router();
//posts를 스키마 포스트js파일에 연결
const Posts = require('../schemas/post.js');

//2. 게시글 작성 api
//제목, 작성자명, 비밀번호, 작성 내용 입력

router.post('/', async (req, res) => {
    try {
        const { user, password, title, content } = req.body;
        await Posts.create({ user, password, title, content });
        return res.status(200).json({ message: '게시글을 생성하였습니다.' })

    } catch {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});




//1. 전체 게시글 목록 조회 api
//제목, 작성자명, 작성 날짜 조회
router.get('/', async (req, res) => {
    const post = await Posts.find({}, { "__v": 0, "password": 0, "content": 0 });
    const postPrint = post.map((value) => {
        return {
            postId: post._id,
            user: post.user,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt
        }
    })
    res.json({ data: postPrint });
});


//작성 날짜 기준 내림차순 정렬
//sort?


//3. 게시글 상세조회 api
//제목, 작성자명, 작성 날짜, 작성 내용 조회 (검색x)
router.get('/:_postId', async (req, res) => {
    try {
        const { _postId } = req.params;
        const post = await Posts.findOne({ _id: _postId }, { "password": 0, "__v": 0 });
        const postPrint = {
            postId: post._id,
            user: post.user,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt
        };
        res.json({ data: postPrint });
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });

    }
});


//게시글 수정
router.put('/:_postId', async (req, res) => {
    try {
        const { _postId } = req.params;
        const { password, title, content } = req.body;
        const [post] = await Posts.find({ _id: _postId });
        if (!post) {
            return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });

        }
        if (password === post.password) {
            await Posts.updateOne({ _id: _postId }, { $set: { title: title, content: content } })
            return res.status(200).json({ message: '게시글을 수정하였습니다.' })

        } else {
            return res.status(404).json({ message: '비밀번호가 다릅니다.' })

        }
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' })

    }
});




//4. 게시글 삭제 api
//api를 호출할 때 입력된 비밀번호를 비교, 동일할 때만 삭제
router.delete('/:_postId', async (req, res) => {
    try {
        const { _postId } = req.params;
        const { password } = req.body;
        //post라는 게시글 작성
        const [post] = await Posts.find({ _id: _postId });

        if (!post) {
            return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' })

        }

        if (password === post.password) {
            await Posts.deleteOne({ _id: _postId })
            return res.status(200).json({ message: '게시글을 삭제하였습니다.' })

        } else {
            return res.status(404).json({ message: '비밀번호가 다릅니다.' })

        }
    } catch {
        res.status(400).send(err.message);
    }
});


module.exports = router;