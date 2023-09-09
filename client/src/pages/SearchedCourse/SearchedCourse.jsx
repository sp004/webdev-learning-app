import React from 'react'
import './SearchedCourse.scss'
import { useLocation, useSearchParams } from 'react-router-dom';
import { SearchFilter, SearchedCourseCard } from '../../components';
import useFetchCourses from '../../hooks/useFetchCourses';
import { useState } from 'react';
import { useEffect } from 'react';
import { BiFilter, BiFilterAlt } from 'react-icons/bi';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';

const SearchedCourse = () => {
    const [sortCourse, setSortCourse] = useState('highest-rated')
    const [sortedCourses, setSortedCourses] = useState([])
    const [openSidebarFilter, setOpenSidebarFilter] = useState(false)
    const location = useLocation();
    // const [searchedCourses, setSearchedCourses] = useState([])
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('query'); 
    useDocumentTitle(`Search courses - Webdev Skool`)
    // useEffect(() => {
    //     const fetchSuggestedCourses = async () => {
    //         if(keyword){
    //             try {
    //                 console.log(keyword)
    //                 const {data} = await axiosPublic.get(`/course/search?query=${keyword}`, {withCredentials: true})
    //                 console.log("♈🚫", data)
    //                 setSearchedCourses(data?.course)
    //             } catch (error) {
    //                 console.log(error?.response?.data)
    //             }
    //         }
    //     }
    //     fetchSuggestedCourses()
    // }, [keyword])
    // console.log(searchedCourses)

    const {courses} = useFetchCourses(`/course/search${location?.search}`)
    useEffect(() => {
        if(sortCourse === 'highest-rated'){
            setSortedCourses(courses?.sort((a, b) => b.avgRating - a.avgRating))
        }else if(sortCourse === 'newest'){
            setSortedCourses(courses?.sort((a, b) => a.uploadedOn - b.uploadedOn))
        }else if(sortCourse === 'price-asc'){
            console.log("*-*-**-")
            setSortedCourses(() => courses?.sort((a, b) => a.price - b.price))
        }else{
            console.log("*+*+*+*+*")
            setSortedCourses(() => courses?.sort((a, b) => b.price - a.price))
        }
    }, [sortCourse, courses])

    const openSidebarFilterHandler = () => {
        setOpenSidebarFilter(prev => !prev)
    }

  return (
    <>
        <div className='searched--container'>
            <div className="search_header--container">
                <h1 className='search_header--title'>{courses?.length} results for "{keyword}"</h1>
                <div className='customize-search'>
                    <FilterSidebar sidebarFilterHandler={openSidebarFilterHandler} openSidebarFilter={openSidebarFilter} />
                    {/* {!openSidebarFilter && <FilterSidebar sidebarFilterHandler={openSidebarFilterHandler} openSidebarFilter={openSidebarFilter} />} */}
                    <div className="search_filter--button" onClick={openSidebarFilterHandler}>
                        <BiFilterAlt />
                        <span>Apply Filters</span>
                    </div>
                    <div className="search_sort--wrapper">
                        <p>Sort By </p>
                        <select name="sortCourse" onClick={(e) => setSortCourse(e.target.value)}>
                            {/* <option defaultValue='' disabled></option> */}
                            <option value="highest-rated">Highest Rated</option>
                            <option value="newest">Newest</option>
                            <option value="price-asc">Price Asc</option>
                            <option value="price-desc">Price Desc</option>
                        </select>
                    </div>
                </div>
            </div>
            <hr />

            {/* main row  */}
            <main className='searched_course--main'>
                <aside className="filters-container">
                    <SearchFilter />
                </aside>

                <section className='searched_course--wrapper'>
                {courses?.length > 0 
                    ? <SearchedCourseCard courses={sortedCourses} />
                    : <h1 className='empty-content'>No related courses are found</h1>
                }
                </section>
            </main>
        </div>
    </>
  )
}

export default SearchedCourse