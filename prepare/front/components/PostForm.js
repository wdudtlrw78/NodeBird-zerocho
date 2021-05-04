import { Form, Button, Input } from 'antd';
import React, { useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { backUrl } from '../config/config';
import useInput from '../hooks/useInput';
import { addPost, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE, ADD_POST_REQUEST } from '../reducers/post';

const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const inputFocus = useRef(null);
  const [text, onChangeText, setText] = useInput('');

  useEffect(() => {
    // 짹쨱해서 트윗을 날리면 다시 보낼 수 있게 초기화가 되어야 한다.
    // 게시글 올렸는데 서버에서 문제가 발생하면 setText로 지워버리는 현상이 발생해서
    // addPostDone 상태일 때 지워야한다.
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }
    // 이미지 없으면 FormData 쓸 필요 없다.
    // 이미지 있어서 FormData로 넘겨준다. (multipart 형식)
    // 이미지 없을 때는
    // data: { // json 형식으로 보내도 된다.
    //   imagePaths,
    //   content: text,
    // }
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append('image', p); // key : image = req.body.image  / multer의 file 경우 single 이면 req.file array면 req.files
      // 이미지나 파일이 아닌 나머지 (text)는 req.body에다가 넣어준다.
    });
    formData.append('content', text); // key : content = req.body.content

    dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
    // setText(''); useEffect 이동
  }, [text, imagePaths]);

  const imageInput = useRef(null);
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    // 이미지 선택하고 확인을 누를 때 onChange 이벤트 실행
    console.log('images', e.target.files); // 선택했던 이미지의 정보들이 들어있고
    const imageFormData = new FormData(); // FormData하면 multipart 형식으로 서버로 보낼 수 있다.
    [].forEach.call(e.target.files, (f) => {
      // [].forEach.call 인 이유는 e.target.files 배열이 아니고 유사배열이여 call로 빌려쓴다.
      imageFormData.append('image', f); // key: image value : f
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onRemoveImage = useCallback(
    (index) => () => {
      dispatch({
        type: REMOVE_IMAGE,
        data: index,
      });
    },
    [],
  );

  return (
    <Form
      style={{ margin: '10px 0 20px' }}
      encType="multipart/form-data" // 이미지를 올리면 "multipart/form-data" 형식이다
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
        ref={inputFocus}
      />
      <div>
        <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right ' }} htmlType="submit">
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            {/* imges를 S3에 올리면 localhost:3060 or backUrl에 저장되는 것이 아니라 따로 S3용 이미지 주소가 생긴다. back/route/images v.location 에 들어있다*/}
            <img src={v} style={{ width: '200px' }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
