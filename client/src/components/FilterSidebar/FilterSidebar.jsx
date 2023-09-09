import React from 'react'
import './FilterSidebar.scss'
import SearchFilter from '../SearchFilter/SearchFilter'
import { MdClose } from 'react-icons/md'

const FilterSidebar = ({sidebarFilterHandler, openSidebarFilter}) => {
  return (
    <div className={`filter-sidebar__container ${openSidebarFilter ? 'filter-sidebar__open' : ''}`}>
        <div className='filter-sidebar__wrapper'>
            <div className='filter-sidebar__close-icon' onClick={() => sidebarFilterHandler()}>
                <MdClose />
            </div>
            <div className='filter-sidebar__main'>
                <SearchFilter />
            </div>
        </div>
    </div>
  )
}

export default FilterSidebar