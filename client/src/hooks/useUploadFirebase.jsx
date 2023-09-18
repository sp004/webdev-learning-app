import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { storage } from '../firebase'
import toast from 'react-hot-toast'

const useUploadFirebase = ({currentUser, prev, folder}) => {
  const [uploadError, setUploadError] = useState({
    thumbError: '',
    videoError: ''
  })
  const [thumbnail, setThumbnail] = useState(null)
  
  const [link, setLink] = useState("")

  //upload thumbnail to firebase storage
  const upload = async () => {
      setUploadError({thumbError: '', videoError: ''})
  
      //check if the file already exists
      const store = getStorage()
      // Create a reference to the file to delete
      const uploadedRef = ref(store, `${folder}/${prev?.name + currentUser?._id}`);
      prev?.name && await deleteObject(uploadedRef)
  
      //check file size
      if(thumbnail?.size > 1000000){
        setUploadError(prev => ({...prev, thumbError: 'Thumbnail size should not exceed 1MB'}))
        return
      }
  
      //upload to firebase storage
      try {
        const thumbnailRef = ref(storage, `thumbnails/${thumbnail?.name + currentUser?._id}`)
        const snapshot = await uploadBytes(thumbnailRef, thumbnail)
        setLink(await getDownloadURL(snapshot.ref))
      } catch (error) {
        toast.error('Something went wrong')
        // console.error(error)
      }
    }

    return [upload, link, prev, uploadError]
}

export default useUploadFirebase

