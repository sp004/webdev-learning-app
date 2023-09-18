import React from 'react'
import { PropagateLoader } from 'react-spinners'

const Loading = ({loading}) => {
  return (
    <div style={{display: 'grid', placeItems: 'center', margin: '5rem auto'}}>
        <PropagateLoader 
            loading={loading}
            size={10}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    </div>
  )
}

export default Loading