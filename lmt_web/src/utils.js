import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa"; // 安裝 react-icons
import "./Chatbot.css";
import { useParams } from "react-router-dom";
import { SlPencil, SlCheck } from "react-icons/sl";
import { MdCancel } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";

function Toast({ message, duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <div className="dialog">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ fontSize: 43 }}
          >
            {message}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
function sendGet(url, handler) {
  try {
    fetch(url, {
      method: "GET",
      headers: new Headers({
        "Content-type": "application/x-www-form-urlencoded"
      })
    })
      .then(res => res.json())
      .then(handler)
      .catch(e => {

      })


  } catch (err) {
    console.log(err)
  }
}
function sendPost(url, data, handler,) {
  try {
    const formData = JSON.stringify(data);
    fetch(url, {
      method: "POST",
      body: formData,   /*使用處理後的資料*/
      credentials: "include",
      headers: new Headers({
        "Content-type": "application/json"
      })
    })
      .then(res => res.json())
      .then(handler)
      .catch(e => {
        /*發生錯誤時要做的事情*/
      })


  } catch (err) {
    console.log(err)
  }
}



function CheckItem({ label = "Mark as complete", onToggle, complete = false }) {
  const [checked, setChecked] = useState(complete);
  const { idx } = useParams();
  const handleClick = () => {
    const newState = !checked;
    setChecked(newState);
    complete = true;

    if (onToggle) onToggle(newState); // 把狀態丟回父層
  };
  useEffect(() => {
    setChecked(complete);
  }, [idx,complete])

  return (
    <div
      onClick={handleClick}
      className="text-light mt-5 mx-5"
      style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "24px" }}
    >
      {checked ? (
        <FaCheckCircle color="green" size={24} />
      ) : (
        <FaRegCircle color="gray" size={24} />
      )}
      <span>{label}</span>
    </div>
  );
}
function StandardInputGroup({name,handleChange,value}){
  return(
  <div class="input-group mb-3 ">
              
    <div class="input-group-prepend ">
      <span class="input-group-text bg-dark text-light border-0" id="basic-addon1">{name}</span>
    </div>
    <input type="text" name={name} value ={value} onChange={handleChange} class="form-control bg-dark text-light border-start" aria-label="Username" aria-describedby="basic-addon1" />
    
  </div>
  )
}
function PlusCard({onSubmit}) {
  const [Form ,setForm]= useState({type:"",title:"",snippet:"",content:""});
  const [isEditing, setIsEditing] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  return (<div className="card shadow-sm mb-5 mx-5 border-0 bg-dark ">
    {isEditing ?
      <div>
      <div style={{
        display: "flex",
        alignItems: "center",   // 水平排列 + 垂直對齊
      }}
        className="mt-3 mx-3">
        <div className="mb-3 mx-3">
        <select value={Form.type} name="type" onChange={handleChange}  class="form-select bg-dark text-light" aria-label="Default select example" >
          <option selected>select source type</option>
          <option value="text">text</option>
          <option value="url">url</option>
          <option disabled value="pdf">pdf coming soon</option>
        </select>
        </div>
        <div className="mb-3 w-75">
          {Form.type==="url"&&
          <div className="flex-column">
            <StandardInputGroup name="title" value={Form.title} handleChange={handleChange}/>
            <StandardInputGroup name="snippet" value={Form.snippet} handleChange={handleChange}/>
            <StandardInputGroup name="content" value={Form.content} handleChange={handleChange}/>

          </div>}
          {Form.type==="text"&&
            <StandardInputGroup name="content" value={Form.content} handleChange={handleChange}/>
          }
        </div>
      </div>
      <div class="row">
        <div class="col-9"></div> 
        <div class="col-3 "><button className="btn btn-primary" onClick={()=>{onSubmit(Form);setIsEditing(false);}}>confirm</button><button onClick ={()=>setIsEditing(false)} className="mx-3 btn btn-danger">cancel</button></div>
      </div>
      </div> :
      <button className="btn" onClick={() => { setIsEditing(true) }}>
        <div className="card-body content">
          <IoAddOutline style={{ color: "white" }} />
        </div>
      </button>}
  </div>
  
  )

}
function ContentCard({ index, src, isEditing, updateMap }) {
  return (<div >{
    src.type === "url" && <div style={{
      display: "flex"
    }}>
            {isEditing && <div className="my-5 mx-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><button className="btn btn-primary" onClick={() => updateMap(index)}><MdCancel /></button></div>}

      <div
        className="card shadow-sm bg-dark my-5 mx-5 border-0"
        style={{flex:1}}
      >

        <a href={src.content}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none">
          <div className="d-flex align-items-center">


            {src.icon && (
              <div>
                <img
                  src={src.icon.src}
                  alt={src.title || "link preview"}
                  className="card-img-top p-3"
                  style={{
                    width: "150px",     // 圖片寬度
                    height: "100%",    // 圖片高度
                    objectFit: "contain",
                    flexShrink: 0       // 不要被壓縮
                  }}
                />
              </div>
            )}
            <div className="card-body">
              <h5 className="card-title text-primary">
                {src.title || "go to link"}
              </h5>
              <p className="card-text text-light">{src.snippet}</p>
            </div>
          </div>
        </a>

      </div></div>
  }
    {
      src.type === "text" && <div style={{display:"flex"}}>
        {isEditing && <div className="my-5 mx-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><button className="btn btn-primary" onClick={() => updateMap(index)}><MdCancel /></button></div>}

        <div className="card shadow-sm mb-5 mx-5 border-0 bg-dark " style={{flex:1}}>
          <div className="card-body content">
            <p className="card-text fs-5 fw-semibold text-light">
              {src.content}
            </p>
          </div>
        </div>
        </div>
    }</div >)
}
function SourceCard({ data, isEditing, updateMap,addSource}) {
  
  //if (!data) return null;
  return <div className="">
    {data.source.map((src, i) => {
      return <ContentCard index={i} key={i} src={src} isEditing={isEditing} updateMap={updateMap} />
    })}
    {isEditing && <PlusCard onSubmit={addSource}/>}
  </div>
}
export default function EditableCard({ map, setMap }) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",   // 水平排列 + 垂直對齊
      }}
      className="mt-3 mx-3"
    >
      {/* 左邊編輯按鈕 */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        style={{
          background: "transparent",
          border: "none",
          color: "#2563eb",
          fontWeight: "500",
          cursor: "pointer",
          marginRight: "0.5rem"
        }}
      >
        {isEditing ? <SlCheck /> : <SlPencil />}
      </button>
      <span style={{ fontSize: "24px" }}>學習地圖名稱:</span>


      {/* 右邊輸入框或文字 */}

      {isEditing ? (
        <input

          value={map.target}
          onChange={(e) => { map.target = e.target.value; setMap(map); }}
          className="bg-dark text-light"
          style={{
            border: "none",
            width: "80%",
            outline: "none",
            fontSize: "24px"
          }}
        />
      ) : (
        <span style={{ borderBottom: "2px solid #ccc", fontSize: "24px" }}>{map.target}</span>
      )}
    </div>
  );
}
export { sendPost, sendGet, Toast, CheckItem, ContentCard, SourceCard, EditableCard, PlusCard }