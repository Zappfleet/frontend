import React, { useEffect, useState } from 'react';
import './style.scss'
import { emoji, comments as commentsLib } from '../../lib/comments'


const Comments = (props: any) => {


    const [type, setType] = useState<any>('good')
    const [selectedEmoji, setSelectedEmoji] = useState<any>(-1)
    const [selectedComments, setSelectedComments] = useState<any>([])
    const [customComment, setCustomComment] = useState<any>('')
    const role = props.registerRole


    const handleSelectedComments = (e: any, result: any, item: any) => {

        let comment = {
            type: result.type,
            value: item
        }

        setSelectedComments((prev: any) => {
            const itemExists = prev.some((ite: any) => ite.value === item);

            if (itemExists) {
                // Remove the comment if it exists
                return prev.filter((c: any) => c.value !== item);
            } else {
                // Add the comment if it does not exist
                return [...prev, comment];
            }
        })

    }

    const saveComment = () => {
        props.saveComment(
            {
                role: role,
                registerID: props.registerID,
                comments: selectedComments,
                emojiID: selectedEmoji,
                customComment: customComment
            }
        )

    }

    const commentListShow = () => {
        const result = commentsLib?.filter(item => item.role === role && item.type === type)
        const k = result && result[0].value.map((item, index) => {
            return <div key={index} className={`col-6  ${index % 2 === 0 ? 'flex-end' : 'flex-start'}`}>
                <div
                    onClick={(e) => handleSelectedComments(e, result[0], item)}
                    className={`comment-div ${selectedComments.some((ite: any) => ite.value === item) ? 'selected-item-div' : ''}`}>{item}</div>
            </div >
        })
        return k
    }

    return (
        <div className='Comments-component'>
            {role && <>
                <div className="row flex-center">
                    <div className="col-12 title-div">
                        <p className='cmd-title'>{'میزان رضایت'}</p>
                        <ul>
                            {emoji.map((item) => {
                                return <li className={`${selectedEmoji === item.key ? 'selectedEmoji' : ''}`}
                                    onClick={() => setSelectedEmoji(item.key)}> <i className={item.icon}></i></li>
                            })}
                        </ul>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6 flex-end">
                        <button
                            className={`${type === 'good' ? 'good-btn' : ''} my-btn  cmd-btn`}
                            onClick={() => setType('good')}>{'نکات مثبت'}</button>
                    </div>
                    <div className="col-6 flex-start">
                        <button
                            className={`${type === 'bad' ? 'bad-btn' : ''} my-btn  cmd-btn`}
                            onClick={() => setType('bad')}>{'نکات منفی'}</button>
                    </div>
                </div>

                <div className="row">
                    {commentListShow()}
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="text">
                            <textarea value={customComment} onChange={(e) => setCustomComment(e.target.value)}
                                className="form-control" rows={5} id="comment"></textarea>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 flex-center">
                        <button onClick={saveComment} className='my-btn regist-btn'> {'ثبت نظر'}</button>
                    </div>
                </div>
            </>
            }
        </div>
    );
};

export default Comments;