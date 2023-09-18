import React from 'react'
import './CourseContent.scss'
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from 'react-accessible-accordion';
import "react-accessible-accordion/dist/fancy-example.css";
import { courseDurationFormatter } from '../../../utils/courseDurationFormatter';

const CourseContent = ({course}) => {
    const {hour: h, minute: m} = courseDurationFormatter(course?.courseContent)
  return (
    <div className="course-content">
        <h2>Course Content</h2>
        <p>
            <span>{course?.courseContent?.length} lectures</span>
            <span>
            {" "}
            • {h}h {m}m total length
            </span>
        </p>

        <Accordion
            // allowMultipleExpanded={isExpanded}
            // allowZeroExpanded={!isExpanded}
            preExpanded={[0]}
        >
            {course?.courseContent?.map((item, i) => {
            return (
                <AccordionItem key={i} uuid={i}>
                    <AccordionItemHeading>
                        <AccordionItemButton>
                        <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>
                            {item.lecture}
                        </span>
                        <span style={{float: 'right'}}>
                            {item.duration} minutes
                        </span>
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel key={i} className="space-bw">
                    <p style={{padding: '8px 2rem'}}>{item.discussion}</p>
                    </AccordionItemPanel>
                </AccordionItem>
            );
            })}
        </Accordion>
    </div>
  )
}

export default CourseContent