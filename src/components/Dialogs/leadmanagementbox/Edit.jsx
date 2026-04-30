import React from 'react'
import { FaPlus } from "react-icons/fa";
import backimage from "../../assets/images/back.png"

const Edit = ({editBox , onclose}) => {
    if(!editBox) return null

    const handelClose =(e)=>{
        e.preventDefault();
        if(e.target.id =="wraper")
            {
                onclose();
            } 
    }
  return (
    <div className='z-20 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm
                    flex justify-center  outline-none' id='wraper' onClick={handelClose}>
        <div className='  w-[80%] px-5 mt-[15px]  flex flex-col ' >
            <button className='text-black text-2xl place-self-end absolute p-3 '
            onClick={()=>onclose()} >X</button>
           <div className='w-full h-[50px]  rounded flex  justify-center  '>
                <h1 className=' text-lg text-center font-medium text-gray  px-2 mt-3 absolute   h-3  ' >
                 Edit Lead
               </h1>
               <img src={backimage} alt='back-image-pic' className='h-full w-full  ' />
                        
             </div>
            <form className=' ' >
                <div className='w-full bg-white flex '>
                <div className='bg-white w-1/2 ' >
                    <div className=' w-full mt-5 flex items-center ' >
                        <label htmlFor='Organization' className='w-1/3 ml-4' > Organization Name</label>
                        <input id='Organization' className='border border-[#00000073] w-1/3 ' type='text'   />
                    </div>
                   
                    <div className=' w-full mt-5 flex items-center '>
                        <label htmlFor='area' className='w-1/3 ml-4' >Area</label>
                        <input  id='area' className='border border-[#00000073] w-1/3' type='text'   />
                    </div>
                    <div className=' w-full mt-5 flex items-center '>
                        <label htmlFor='city' className='w-1/3 ml-4' >City</label>
                        <input id='city' className='border border-[#00000073] w-1/3' type='text'   />
                    </div>
                    <div className=' w-full mt-5 flex items-center '>
                        <label htmlFor='pincode' className='w-1/3 ml-4' >Pincode</label>
                        <input id='pincode' className='border border-[#00000073] w-1/3' type='text'   />
                    </div>
                    <div className=' w-full mt-5 flex items-center '>
                        <label htmlFor='callobjective' className='w-1/3 ml-4' >Call Objective</label>
                        <input id='callobjective' className='border border-[#00000073] w-1/3' type='text'   />
                    </div>
                    <div className=' w-full mt-5 flex items-center '>
                        <label htmlFor='targeteddepartment' className='w-1/3 ml-4' >Targeted Department</label>
                        <input id='targeteddepartment' className='border border-[#00000073] w-1/3' type='text'   />
                    </div>
                    <div className=' w-full mt-5 flex items-center '>
                        <label htmlFor='lastmeeting' className='w-1/3 ml-4' >Last Meeting</label>
                        <input id='lastmeeting' className='border border-[#00000073] w-1/3' type='text'   />
                    </div>
                    <div className=' w-full mt-5 flex items-center '>
                        <label htmlFor='requiredsupport' className='w-1/3 ml-4' >Required Support</label>
                        <input id='requiredsupport' className='border border-[#00000073] w-1/3' type='text'   />
                    </div>
                    <div className=' w-full mt-5 flex items-center '>
                        <label htmlFor='salesexpected' className='w-1/3 ml-4' >Sales Expected</label>
                        <input id='salesexpected' className='border border-[#00000073] w-1/3' type='text'   />
                    </div>
                    <div className=' w-full mt-5 flex items-center '>
                        <label htmlFor='leadowner' className='w-1/3 ml-4' >Lead Owner</label>
                        <input id='leadowner' className='border border-[#00000073] w-1/3' type='text'   />
                    </div>
                </div>
                <div className='w-1/2 mt-3 '>
                    <div className=' w-full  flex items-center '>
                        <label htmlFor='address' className='w-1/3 ml-4' >Address</label>
                        <textarea id='address' cols={2} rows={4}  className=' rounded-md border border-[#00000073] focus:border-none w-1/2' type='text'   />
                    </div>
                    <div className=' w-full   flex items-center '>
                        <h1 className='w-1/3 ml-4 ' >Lead Generated through</h1>
                        <div className='flex flex-col gap-2 ' >
                        <div className='flex gap-2  p-1'>
                        <input id='email' className='border border-[#00000073]' type='Checkbox'   />
                        <label htmlFor='email' >Email</label>
                        </div>
                        <div className='flex gap-2   p-1'>
                        <input id='calling' className='border border-[#00000073]' type='Checkbox' name='email'  />
                        <label htmlFor='calling' >Calling</label>
                        </div>
                        <div className='flex gap-2   p-1'>
                        <input id='meeting' className='border border-[#00000073]' type='Checkbox' name='meeting'  />
                        <label htmlFor='meeting' >Meeting</label>
                        </div>
                        </div>

                    </div>
                    <div className='  w-full  flex items-center  mt-2 '>
                        <label htmlFor='nextcallobjective' className='w-1/4 ml-4' >Next Call Objective</label>
                        <FaPlus className='bg-blue-500 text-white text-lg mx-3 rounded'/>
                        <input id='nextcallobjective' className='border border-[#00000073] w-1/2 ml-3 '  type='text' name=''  />
                    </div>
                    <div className='  w-full  flex items-center mt-2  '>
                        <label htmlFor='discussionpoints' className='w-1/4 ml-4' >Discussion Points</label>
                        <FaPlus className='bg-blue-500 text-white text-lg mx-3 rounded'/>
                        <input id='discussionpoints' className='border border-[#00000073]  w-1/2 ml-3 ' type='text' name=''  />
                    </div>
                    <div className='mt-2 w-full  flex items-center  '>
                        <label htmlFor='nextdollowup' className='w-1/4 ml-4' >Netx Follow Up</label>
                        <FaPlus className='bg-blue-500 text-white text-lg mx-3 rounded'/>
                        <input id='nextdollowup' className='border border-[#00000073] w-1/2 ml-3'type='text' name=''  />
                    </div>
                    <div className='mt-2 w-full flex items-center  '>
                        <label htmlFor='comments' className='w-1/4 ml-4' >Comments</label>
                        <FaPlus className='bg-blue-500 text-white text-lg mx-3 rounded'/>
                        <input id='comments' className='border border-[#00000073] w-1/2 ml-3' type='text' name=''  />
                    </div>
                    <div className=' w-full  flex items-center  mt-2 '>
                        <label htmlFor='status' className='w-1/4 ml-4' >Status</label>
                        <FaPlus className='bg-blue-500 text-white text-lg mx-3 rounded'/>
                        <input id='status' className='border border-[#00000073] w-1/2 ml-3' type='text' name=''  />
                    </div>
                    <div className='mt-5 w-full  flex items-center gap-3 '>
                        <h1 className='w-1/3 ml-4' > Category</h1>
                        <div className='flex gap-2' >
                        <input id='hot' className='border border-[#00000073] w-1/3' type='checkbox' name=''  />
                        <label htmlFor='hot' className='px-6 bg-[#ED0E3F33] text-[#EF6E68CC] rounded-md text-[15px]' >HOT</label>
                        </div>
                        <div className='flex gap-3'>
                        <input id='hot' className='border border-[#00000073] w-1/3' type='checkbox'   />
                        <label htmlFor='WARM' className='px-6 bg-[#FBBC1A61] text-[#FF9600CC] rounded-md text-[15px]' >WARM</label>
                        </div>
                        <div className='flex gap-3'>
                        <input id='hot' className='border border-[#00000073] w-1/3' type='checkbox'   />
                        <label htmlFor='hot' className='px-6 bg-[#399EB561] text-[#2196F3CC] rounded-md text-[15px]' >COLD</label>
                        </div>
                    </div>

                </div> 
                    
                </div>
                <div className='flex bg-white w-full h-24 items-center justify-evenly' >
                    <button className='py-3 px-6 bg-blue-600 rounded-md text-white font-Poppins text-lg hover:bg-slate-400 hover:text-black' > Update</button>
                    <button className='py-3 px-6 bg-blue-600 rounded-md  text-white font-Poppins text-lg hover:bg-slate-400 hover:text-black' onClick={()=>onclose()}> Cancel</button>
                    </div>
                
            </form>
         </div>
      </div>  )
}

export default Edit