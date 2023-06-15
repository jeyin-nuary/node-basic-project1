//깃헙 참고함
const express = require('express');
const router = express.Router();

const Posts = require('../schemas/post.js');
const Comments = require('../schemas/comment.js');

//2. 댓글 작성
//댓글 내용 비워둔 채 댓글 작성 api 호출 시 "댓글 내용을 입력해주세요" 메시지 return
//유효성 검사, alert?
router.post('/:_postId/comments', async (req, res) => {
    try {
        const { _postId } = req.params;
        try {
            const { user, password, content } = req.body;
            await Comments.create({ postId: _postId, user, password, content });
            return res.status(200).json({ message: '댓글을 생성하였습니다.' });
        } catch {
            return res.status(400).send({ message: '댓글 내용을 입력해주세요.' });
        }
    } catch {
        return res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});


//댓글 내용 입력 후 댓글 작성 api를 호출한 경우 작성한 댓글 추가








//1. 댓글 목록 조회
//조회하는 게시글에 작성된 모든 댓글 목록 형식으로
//작성 날짜 기준 내림차순 정렬

router.get('/:_postId/comments', async (req, res) => {
    try {
        const { _postId } = req.params;
        const comments = await Comments.find({ "postId": _postId }, { "_v": 0, "postId": 0, "password": 0 });
        const commentsPrint = comments.map((value) => {
            return {
                commentId: value._id,
                user: value.user,
                content: value.content,
                createdAt: value.createdAt
            }
        });
        res.json({ "data": commentsPrint })
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
})







//3. 댓글 수정
//댓글 내용 비워둔 채 댓글 수정 api호출 시 "댓글 내용을 입력해주세요"메시지 return
//유효성 검사, alert

router.put('/:_postId/comments/:_commentId', async (req, res) => {
    try {
        const { _postId, _commentId } = req.params;
        const [post] = await Posts.findOne({ _id: _postId });
        const [comment] = await Comments.find({ _id: _commentId });
        const { password, content } = req.body;
        if (!post) {
            return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
        }
        if (!comment) {
            return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });

        }
        if (password === comment.password) {
            await Comments.updateOne({ _id: _commentId }, { $set: { content: content } })
            return res.status(200).json({ message: '댓글을 수정하였습니다.' });
        } else {
            return res.status(404).json({ message: '비밀번호가 다릅니다.' })
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});


//댓글 내용 입력하고 댓글 수정 api 호출 시 작성 댓글 수정




//4. 댓글 삭제
//원하는 댓글 삭제. 댓글은 비밀번호x
router.delete('/:postId/comments/:_commentId', async (req, res) => {
    try {
        const { _postId, _commentId } = req.params;
        const [post] = await Posts.find({ _id: _commentId });
        const [comment] = await Comments.find({ _id: _commentId });
        const { password } = req.body;
        if (!post) {
            return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
        }
        if (!comment) {
            return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });

        }
        if (password === comment.password) {
            await Comments.deleteOne({ _id: _commentId })
            return res.status(200).json({ message: '댓글을 삭제하였습니다.' });

        } else {
            return res.status(404).json({ message: '비밀번호가 다릅니다.' });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send(err.message)
    }
});

module.exports = router;









