import React from 'react'
import backimage from "../../assets/images/back.png"

const Information = ({infoBox , onclose}) => {

  if(!infoBox) return null;

  const handelClose =(e)=>{
    if(e.target.id =="wraper") onclose();
}
return (
<div className=' fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm
                flex justify-center  z-20' id='wraper' onClick={handelClose}>
    <div className='  w-[80%] ml-[220px] px-5 mt-[75px]  flex flex-col ' >
        <button className='text-black  text-2xl place-self-end absolute p-3 '
        onClick={()=>onclose()} >X</button>
       <div className='w-full h-[50px]  rounded flex justify-center '>
          <h1 className=' text-lg text-center font-medium text-gray  px-2 mt-3 absolute   h-3  ' >
              Lead Successfully
            </h1>
              <img src={backimage} alt='back-image-pic' className='h-full w-full  ' />
                    
         </div>
            <div className='w-full bg-white flex  '>
            <div className='bg-white w-1/2 mb-10 ' >
                <div className=' w-full mt-5 flex items-center ' >
                    <h1 className='w-1/3 ml-4' > Organization Name</h1>
                    <p className='  w-1/ font-Poppins text-[17px]3 font-Poppins font-light text-[17px]' >Lata Mangeskar Hospital</p> 
                </div>
               
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Area</h1>
                    <p className=' w-1/3 font-Poppins  font-Poppins font-light text-[17px]'  >Hello everyone</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >City</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >Nagpur</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Pincode</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >440034</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Call Objective</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >Product Sale</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Targeted Department</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >Neurology</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Last Meeting</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >22-08-2024</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Required Support</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >Want approval From Dean</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Sales Expected</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >01-11-2024</p> 
                </div>
                <div className=' w-full mt-5 flex items-center '>
                    <h1 className='w-1/3 ml-4' >Lead Owner</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >Abhijit Kulkarni</p> 
                </div>
            </div>
            <div className='w-1/2  '>
                <div className=' w-full  flex items-center mt-5 '>
                    <h1 className='w-1/3 ml-4' >Address</h1>
                    <p   className=' w-1/3 font-Poppins font-light text-[17px]/2'  >Plot No 61 Mahatma Gandhi  Nagar Hudkeshwar Road</p>
                </div>
                <div className=' w-full   flex items-center mt-4 '>
                    <h1 className='w-1/3 ml-4 ' >Lead Generated through</h1>
                       <p className='w-1/3 font-Poppins font-light text-[17px]'  >Meeting</p>

                </div>
              
                <div className=' w-full  flex items-center  mt-4'>
                    <h1 className='w-1/3 ml-4' >Next Call Objective</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >Quotation for Product </p> 
                </div>
                <div className='  w-full  flex items-center mt-4  '>
                    <h1 className='w-1/3 ml-4' >Discussion Points</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >Need Quotation Of Product Ready to Buy Product Positive Attitude </p> 
                </div>
                <div className=' w-full  flex items-center mt-4 '>
                    <h1 className='w-1/3 ml-4' >Next Follow Up</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >30-08-2024</p> 
                </div>
                <div className=' w-full flex items-center mt-4 '>
                    <h1 className='w-1/3 ml-4' >Comments</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >He is positive toward buying Product</p> 
                </div>
                <div className=' w-full  flex items-center mt-4  '>
                    <h1 className='w-1/3 ml-4' >Status</h1>
                    <p className=' w-1/3 font-Poppins font-light text-[17px]'  >Procurement sale</p> 
                </div>
                <div className='mt-5 w-full  flex items-center  '>
                    <h1 className='w-1/3 ml-4' > Category</h1>
                    <p className='px-6 bg-[#ED0E3F33] text-[#EF6E68CC] rounded-md text-[15px]' >HOT</p>
                   
                </div>

            </div> 
                
            </div>
           
            
     </div>
  </div>  )
}

export default Information