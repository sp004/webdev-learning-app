import React, { useEffect, useRef, useState } from 'react'
import { SubNavbar } from '../../components'
import './CreateCourse.scss'
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {ref, uploadBytes, getDownloadURL, getStorage, deleteObject} from 'firebase/storage'
import { storage } from '../../firebase';
import { useSelector } from 'react-redux';
import { axiosPublic } from '../../api/apiMethod';
import { instructorSubNavLinks } from '../../utils';
import { toast } from 'react-hot-toast';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const CreateCourse = () => {
  useDocumentTitle(`Create course - Webdev Skool`)
  const {currentUser} = useSelector(state => state.auth)
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [thumbnailLink, setThumbnailLink] = useState("")
  const [videoLink, setVideoLink] = useState("")
  const [uploadError, setUploadError] = useState({
    thumbError: '',
    videoError: ''
  })
  const [thumbnail, setThumbnail] = useState(null)
  const [video, setVideo] = useState(null)
  const [prevThumb, setPrevThumb] = useState(null)
  const [prevVideo, setPrevVideo] = useState(null)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [confirmMsg, setConfirmMsg] = useState("")

  const imgRef = useRef()
  const vidRef = useRef()

  const validationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    price: yup.number().integer().positive().required("Price is required"),
    coupon: yup.string(),
    category: yup.string().required("Category is required"),
    level: yup.string().required("Level is required"),
    numberOfLectures: yup.number(),
    courseContent: yup.array().of(
      yup.object().shape({
        lecture: yup.string().required("Lecture is required"),
        duration: yup.number().integer().positive().required("Duration is required"),
        discussion: yup.string().required("Short discussion is required"),
      })
    )
  })

  const { 
    register, 
    handleSubmit, 
    watch,
    control,
    formState: {errors, touchedFields, isValid}, //subscribe to errors state
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onTouched"
  });
  const { fields, append, remove } = useFieldArray({ name: 'courseContent', control });

  const nextHandler = () => {
    setStep((prev) => prev + 1)
  }

  const prevHandler = () => {
    setStep((prev) => prev - 1)
  }

  // watch to enable re-render when ticket number is changed
  const numberOfLectures = watch('numberOfLectures');
  const watchedFields = watch();

  useEffect(() => {
    const subscription = watch(() => {})
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    const newVal = parseInt(numberOfLectures || 0);
    const oldVal = fields.length;

    if (newVal > oldVal) {
      for (let i = oldVal; i < newVal; i++) {
        append({ lecture: '', duration: '' });
      }
    } else {
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1);
      }
    }
  }, [numberOfLectures, append, remove, fields.length]);

  const removeHandler = (index) => {  
    remove(index);
  }

  useEffect(() => {
    if(thumbnail){
      setPrevThumb(thumbnail);
      uploadThumbnail()
    }
  }, [thumbnail])

  useEffect(() => {
    if(video){
      setPrevVideo(video);
      uploadVideo()
    }
  }, [video])


  //upload thumbnail to firebase storage
  const uploadThumbnail = async() => {
    setUploadError({thumbError: '', videoError: ''})

    //check file size
    if(thumbnail?.size > 1000000){
      setUploadError(prev => ({...prev, thumbError: 'Thumbnail size should not exceed 1MB'}))
      return
    }

    //check if the file already exists
    const store = getStorage()

    // Create a reference to the file to delete
    const uploadedImgRef = ref(store, `thumbnails/${prevThumb?.name + currentUser?._id}`);

    (prevThumb?.name && uploadedImgRef?._location?.path_) && await deleteObject(uploadedImgRef)

    //upload to firebase storage
    try {
      const thumbnailRef = ref(storage, `thumbnails/${thumbnail?.name + currentUser?._id}`)
      const snapshot = await uploadBytes(thumbnailRef, thumbnail)
      setThumbnailLink(await getDownloadURL(snapshot.ref))
    } catch (error) {
      toast.error('Something went wrong')
      // console.error(error)
    }
  }

  //upload video to firebase storage
  const uploadVideo = async() => {
    setUploadError({thumbError: '', videoError: ''})

    //check if the file already exists
    const store = getStorage()

    // Create a reference to the file to delete
    const uploadedVidRef = ref(store, `videos/${prevVideo?.name + currentUser?._id}`);

    prevVideo?.name && await deleteObject(uploadedVidRef)

    if(video?.size > 5242880){
      setUploadError(prev => ({...prev, videoError: 'Thumbnail size should not exceed 5MB'}))
      return
    }
    try {
      const videoRef = ref(storage, `videos/${video?.name + currentUser?._id}`)
      const snapshot = await uploadBytes(videoRef, video)
      setVideoLink(await getDownloadURL(snapshot.ref))
    } catch (error) {
      toast.error('Something went wrong')
      // console.error(error)
    }
  }

  const formSubmitHandler = async (data) => {
    try {
      const res = await axiosPublic.post('/course/create', {...data, thumbnail: thumbnailLink, video: videoLink}, {withCredentials: true})

      if(res?.status === 201){
        setConfirmMsg("Your course has been submitted successfully. After admin verification, it will be published.")
        setTimeout(() => {
          navigate('/instructor/dashboard/', {replace: true})
        }, 5000)
      }
    } catch (error) {
      toast.error('Something went wrong')
      // console.log(error)
      if(error?.response?.status === 401){
        toast.error(error?.response?.data?.message)
        return
      }
      toast.error("Something went wrong")
    }
  }

  return (
    <>
      <SubNavbar title='Instructor Dashboard' links={instructorSubNavLinks} />
      
      <main className='create-course_container'>
        <div className='create-course_heading'>
          <h2>Create and Publish Your Course Now</h2>
          <p>Fill up all the fields below and submit the form. We will review and will sent you an email once the course will be approved.</p>
        </div>
        {/* <form onSubmit={handleSubmit(formInfoHandler)}> */}
        {step === 1 && (
          <div className='create-course_form'>
            <h2>Add Course Info</h2>
            <div className='input-field'>
              <label>Title<span className='asterisk'>*</span></label>
              <input {...register("title")} autoComplete='off' />
              <p className='input-error'>{errors.title?.message}</p>
            </div>
            <div className='input-field'>
              <label>Description<span className='asterisk'>*</span></label>
              <input {...register("description")} autoComplete='off' />
              <p className='input-error'>{errors.description?.message}</p>
            </div>

            {/* same row  */}
            <div className='input-field inline-fields'>
              <div>
                <label>Category<span className='asterisk'>*</span></label>
                <select {...register("category")}>
                  <option value="" selected disabled></option>
                  <option value="frontend">Frontend Development</option>
                  <option value="backend">Backend Development</option>
                  <option value="fullstack">Fullstack Development</option>
                </select>
                {/* <input type="text" {...register("category")} /> */}
                <p className='input-error'>{errors.category?.message}</p>
              </div>
              <div>
                <label>Level<span className='asterisk'>*</span></label>
                <select {...register("level")}>
                  <option value="" selected disabled></option>
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              
                <p className='input-error'>{errors.level?.message}</p>
              </div>
            </div>
            {/* languages  */}
            {/* <div>
              <label>Language<span className='asterisk'>*</span></label>
              <select {...register("language")}>
                <option value="" selected disabled></option>
              </select>
            
              <p className='input-error'>{errors.level?.message}</p>
            </div> */}
            {/* price  */}
            <div className="input-field inline-fields">
              <div>
                <label>Price<span className='asterisk'>*</span></label>
                <input {...register("price")} autoComplete='off' />
                <p className='input-error'>{errors.price?.message}</p>
              </div>
              <div>
                <label>Coupon Code</label>
                <input {...register("coupon")} disabled />
              </div>
            </div>

            <div className='create-course__button-container'>
              <input type="button" value="Next" onClick={nextHandler} disabled={!isValid} />
            </div>
          </div>
        )}
        {/* </form> */}
        {/* <button onClick={formInfoHandler}>Add Info</button> */}

        {step === 2 && (
          <div className='create-course_form'>
            <h2>Add Course Content</h2>
            <div>
              <div className='input-field'>
                <label>Number of Lectures<span className='asterisk'>*</span></label>
                <select name="numberOfLectures" {...register('numberOfLectures')}>
                  {['', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i =>
                    <option key={i} value={i}>{i}</option>
                  )}
                </select>
              </div>

              <>
                {fields.map((item, i) => (
                  <div key={i} className='lecture-section'>
                    <h5>Lecture {i + 1}</h5>
                    <div className='inline-fields'>
                      <div className='input-field'>
                        <label>Lecture<span className='asterisk'>*</span></label>
                        <input name={`courseContent[${i}]lecture`} {...register(`courseContent.${i}.lecture`)} type="text" autoComplete='off' />
                        <p className='input-error'>{errors.courseContent?.[i]?.lecture?.message}</p>
                      </div>
                      <div className="form-group col-6 input-field">
                        <label>Duration<span className='asterisk'>*</span></label>
                        <input name={`courseContent[${i}]duration`} {...register(`courseContent.${i}.duration`)} type="number" autoComplete='off' />
                        <p className='input-error'>{errors.courseContent?.[i]?.duration?.message}</p>
                      </div>
                    </div>
                      <div className="form-group col-6 input-field">
                        <label>Topics Discussed<span className='asterisk'>*</span></label>
                        <input name={`courseContent[${i}]discussion`} {...register(`courseContent.${i}.discussion`)} type="text" autoComplete='off' />
                        <p className='input-error'>{errors.courseContent?.[i]?.discussion?.message}</p>
                      </div>
                    <button onClick={() => removeHandler(i)} className='button-cart --flex-center remove-button'>Clear Lecture</button>
                  </div>
                  ))}
              </>
              
              <div className='create-course__button-container'>
                <input type="button" value="Prev" onClick={prevHandler} />
                <input type="button" value="Next" onClick={nextHandler} disabled={!isValid} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className='create-course_form'>
            <h2>Upload Course Thumbnail & Video</h2>
            <div className='input-field'>
              <label htmlFor='thumbnail'>Upload Thumbnail<span className='asterisk'>*</span></label><span>{thumbnail?.name}</span>
              <input type="file" name='thumbnail' id='thumbnail' ref={imgRef} style={{display: 'none'}} accept='image/*'
                onChange={() => setThumbnail(imgRef.current.files[0])}
              />
            </div>
            <p className='input-error'>{uploadError?.thumbError}</p>

            <div className='input-field'>
              <label type='button' htmlFor='video'>Upload Video<span className='asterisk'>*</span></label><span>{video?.name}</span>
              <input type="file" name='video' id='video' style={{display: 'none'}} ref={vidRef} accept='video/*' 
              onChange={() => setVideo(vidRef.current.files[0])} 
            />
            </div>

            <div className='create-course__button-container'>
              <input type="button" value="Prev" onClick={prevHandler} className='button-cart create-course_button' />
              <input type="button" value="Next" disabled={!thumbnail || !video} onClick={nextHandler} />
            </div>
          </div>
        )}

        {/* 4th step  */}
        {step === 4 && (
          <div className='create-course_form'>
            <h2>Preview</h2>
            <div className='preview-field'>
              <h4>Title</h4>
              <p>{watchedFields?.title}</p>
            </div>
            <div className='preview-field'>
              <h4>Description</h4>
              <p>{watchedFields?.description}</p>
            </div>
            <div className='preview-field'>
              <h4>Category</h4>
              <p>{watchedFields?.category?.charAt(0)?.toUpperCase() +  watchedFields?.category?.slice(1)}</p>
            </div>
            <div className='preview-field'>
              <h4>Level</h4>
              <p>{watchedFields?.level?.charAt(0)?.toUpperCase() +  watchedFields?.level?.slice(1)}</p>
            </div>
            <div className='preview-field'>
              <h4>Price</h4>
              <p>{watchedFields?.price}</p>
            </div>
            <div className='preview-field'>
              <h4>Thumbnail</h4>
              <img src={thumbnailLink} style={{height: "100px", width: "200px", border: '1px solid #111'}} className='preview-thumbnail' alt="thumnail" />
            </div>
            <div className='preview-field'>
              <h4>Video</h4>
              <video src={videoLink} controls autoPlay className='preview-video' />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Sl No.</th>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>Discussion</th>
                </tr>
              </thead>
              <tbody>
                {watchedFields?.courseContent?.map((lecture, i) => (
                  <tr key={i}>
                    <td>{i+1}</td>
                    <td>{lecture.lecture}</td>
                    <td>{lecture.duration} min</td>
                    <td>{lecture.discussion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='preview-confirm'>
              <input type="checkbox" name="confirmSubmit" checked={confirmSubmit} onChange={() => setConfirmSubmit(prev => !prev)} />&nbsp;
              <p>I'm satisfied with the course details and ready to submit</p>
            </div>
            <form onSubmit={handleSubmit(formSubmitHandler)}>
              <div className='create-course__button-container'>
                <input type="button" value="Prev" onClick={prevHandler} />
                <button className='create-course__button' disabled={!confirmSubmit || Object.keys(touchedFields).length === 0 || Object.keys(errors).length > 0}>Submit</button>
              </div>
            </form>
            {confirmMsg && <p className='confirm-message--alert'>{confirmMsg}</p>}
          </div>
        )}
      </main>
    </>
  )
}

export default CreateCourse