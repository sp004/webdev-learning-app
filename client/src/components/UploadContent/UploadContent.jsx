import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { storage } from "../../firebase";
import toast from "react-hot-toast";

const UploadContent = ({ prevHandler, nextHandler}) => {
  const [thumbnailLink, setThumbnailLink] = useState("")
  const [videoLink, setVideoLink] = useState("")
  const [uploadItems, setUploadItems] = useState({
    thumbnail: null,
    video: null
  })
  const [uploadError, setUploadError] = useState({
    thumbError: '',
    videoError: ''
  })

  const changeUploadItems = async (e) => {
    const {name, files} = e.target
    setUploadItems((prev) => ({...prev, [name]: files[0]}))
}

  //upload thumbnail to firebase storage
  const uploadThumbnail = async() => {
    setUploadError({thumbError: '', videoError: ''})
    // setThumbnail(e.target.files[0])
    if(uploadItems?.thumbnail?.size > 100000){
      setUploadError(prev => ({...prev, thumbError: 'Thumbnail size should not exceed 1MB'}))
      return
    }
    try {
      const thumbnailRef = ref(storage, `thumbnails/${uploadItems?.thumbnail?.name + v4()}`)
      const snapshot = await uploadBytes(thumbnailRef, uploadItems?.thumbnail)
      setThumbnailLink(await getDownloadURL(snapshot.ref))
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  //upload video to firebase storage
  const uploadVideo = async() => {
    setUploadError({thumbError: '', videoError: ''})
    // setThumbnail(e.target.files[0])
    if(uploadItems?.video?.size > 10000000){
      setUploadError(prev => ({...prev, videoError: 'Thumbnail size should not exceed 10MB'}))
      return
    }
    try {
      const videoRef = ref(storage, `videos/${uploadItems?.video?.name + v4()}`)
      const snapshot = await uploadBytes(videoRef, uploadItems?.video)
      setVideoLink(await getDownloadURL(snapshot.ref))
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  useEffect(() => {
    if(uploadItems?.thumbnail){
        uploadThumbnail()
    }
    if(uploadItems?.video){
      uploadVideo()
    }
  }, [uploadItems.thumbnail, uploadItems.video])

  return (
    <>
      <div>
        <label htmlFor="thumbnail">Upload Thumbnail</label>
        <span>{uploadItems?.thumbnail?.name}</span>
        <input
          type="file"
          name="thumbnail"
          id="thumbnail"
          style={{ display: "none" }}
          accept="image/*"
          onChange={changeUploadItems}
        />
      </div>
      <p>{uploadError?.thumbError}</p>

      <div>
        <label type="button" htmlFor="video">
          Upload Video
        </label>
        <span>{uploadItems?.video?.name}</span>
        <input
          type="file"
          name="video"
          id="video"
          style={{ display: "none" }}
          accept="video/*"
          onChange={changeUploadItems}
        />
      </div>

      <input type="button" value="Prev" onClick={prevHandler} />
      <input type="button" value="Next" onClick={nextHandler} />
    </>
  );
};

export default UploadContent;
