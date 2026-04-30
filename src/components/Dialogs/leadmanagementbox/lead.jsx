import React , {useEffect} from 'react'
import backimage from "../../assets/images/back.png"
import { FaRegEdit, FaSlack } from "react-icons/fa";
import useLeadManagement from '../../hooks/leadmanagement/useLeadManagement';

const Lead = ({infoBox ,data, onclose}) => {
    
    if(!infoBox) return null;
    console.log("lead data",data)
    const {fetchLeadManagementDetails,leadManagementDetail} = useLeadManagement()
    useEffect(()=>{
        fetchLeadManagementDetails(data)
    },[])

  const handelClose =(e)=>{
    if(e.target.id =="wraper") onclose();
}
return (
<div className=' fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm
                flex justify-center  z-20' id='wraper' onClick={handelClose}>
    <div className='relative  w-[80%]  px-5 mt-[0px]  flex flex-col ' >
         
              <FaRegEdit  className='absolute top-[18px] right-[70px] font-Poppins font-medium text-xl h-5 py-0.5  cursor-pointer '  />
        <button className='text-black  text-2xl place-self-end absolute p-3 '
        onClick={()=>onclose()} >X</button>
       
       <div className='w-full h-[50px]  rounded flex justify-center '>
          <h1 className=' text-lg text-center font-medium text-gray  px-2 mt-3 absolute   h-3  ' >
              View Lead
            </h1>
              <img src={backimage} alt='back-image-pic' className='h-full w-full  ' />
            
         </div>
            <div className='w-full bg-white flex  '>
            <div className='bg-white w-1/2 mb-10 ' >
                <div className=' w-full mt-5 flex items-center ' >
                    <h1 className='w-1/3 ml-4' > Organization Name</h1>
                    <p className='  w-1/ font-Poppins text-[17px]3 font-Poppins font-light text-[17px]' >{leadManagementDetail.organizationName}</p> 
                </div>
               
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Area</h1>
                    <p className=' w-1/3 font-Poppins  font-Poppins font-light text-[17px]'  >{leadManagementDetail.area}</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >City</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.city}</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Pincode</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.pincode}</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Call Objective</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.callObjective}</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Targeted Department</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.targetDepartment}</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Last Meeting</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.lastMeeting}</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Required Support</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.requiredSupport}</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Sales Expected</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.salesExpected}</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Lead Owner</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.leadOwner}</p> 
                </div>
            </div>
            <div className='w-1/2  '>
                <div className=' w-full  flex items-center mt-5 '>
                    <h1 className='w-1/3 ml-4' >Address</h1>
                    <p   className=' w-1/3 font-Poppins font-light text-[17px]/2'  >{leadManagementDetail.address}</p>
                </div>
                <div className=' w-full   flex items-center mt-4 '>
                    <h1 className='w-1/3 ml-4 ' >Lead Generated through</h1>
                       <p className='w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.leadGenratedThrough.join(", ")}</p>

                </div>
              
                <div className=' w-full  flex items-center  mt-4'>
                    <h1 className='w-1/3 ml-4' >Next Call Objective</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.nextCallObjective} </p> 
                </div>
                <div className='  w-full  flex items-center mt-4  '>
                    <h1 className='w-1/3 ml-4' >Discussion Points</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.discussionPoints}</p> 
                </div>
                <div className=' w-full  flex items-center mt-4 '>
                    <h1 className='w-1/3 ml-4' >Next Follow Up</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.nextFollowUp}</p> 
                </div>
                <div className=' w-full flex items-center mt-4 '>
                    <h1 className='w-1/3 ml-4' >Comments</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.comments}</p> 
                </div>
                <div className=' w-full  flex items-center mt-4  '>
                    <h1 className='w-1/3 ml-4' >Status</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >{leadManagementDetail.status}</p> 
                </div>
                <div className='mt-5 w-full  flex items-center  '>
                    <h1 className='w-1/3 ml-4' > Category</h1>
                    {/* <p className='px-6 bg-[#ED0E3F33] text-[#EF6E68CC] rounded-md text-[15px]' >{leadManagementDetail.}</p> */}
                   
                </div>

            </div> 
                
            </div>
           
            
     </div>
  </div>  )
}

export default Lead