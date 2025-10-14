// App.js
import React, { useEffect, useState, } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.js";
import "./Tracker.css";
import { CheckItem, sendPost, ContentCard, SourceCard} from "./utils.js";
import { SlArrowDown, SlArrowRight, SlCheck } from "react-icons/sl";

function TreeItem({ title, children, leaf = false, pathname, complete = false ,role=""}) {
  const navigate = useNavigate();
  let backgroundColor=role==="phase"?"bg-secondary":"bg-dark"

  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2 " >
      <div
        className={`p-2 ${backgroundColor} border-start  text-light`}
        style={{ cursor: "pointer", fontSize: "16px" }}
        onClick={!leaf ? () => setOpen(!open) : () => { navigate(pathname) }}
      >
        {complete && <i class="bi bi-check-circle-fill text-success"><SlCheck /></i>}
        {title} {leaf ? "" : open ? <SlArrowDown />
          : <SlArrowRight />

        }
      </div>
      {open && <div className="ms-3 mt-2">{children}</div>}
    </div>
  );
}
function checkComplete(mapped) {
  if (!mapped) return;
  for (let phase of mapped) {
    let phaseclear = true;
    let contentclear = true;
    let testclear = true;
    let practiceclear = true;
    for (let content of phase.content) {
      if (content.complete !== true) {
        contentclear = false;
        phaseclear = false;
      }
    }
    for (let practice of phase.practice) {
      if (practice.complete !== true) {
        practiceclear = false;
        phaseclear = false;

      }
    }
    if (phase.test.complete !== true) {
      testclear = false;
      phaseclear = false;
    }
    phase.practicecomplete = practiceclear;
    phase.testcomplete = testclear;
    phase.contentcomplete = contentclear;
    phase.complete = phaseclear;
  }
  console.log(mapped);
}

function Sidebar({ mapped, uuid, target ,isEditing,setIsEditing}) {


  return (
    <div className=" container p-3 bg-dark  " style={{ minHeight: "100vh", width: "20%", margin: "30px 50px", borderRadius: "22px" }}>
      <h5 className="text-light">Subject</h5>

      <h5 className="text-light">{target}</h5>

      {mapped && mapped.map((phase, i) => (
        <TreeItem role="phase" key={i} title={`${phase.name} (${phase.time})`} complete={phase.complete}>
          <TreeItem title={`Test：${phase.test.name}`} complete={phase.testcomplete}>
            <TreeItem title={phase.test.name} leaf={true} pathname={`/tracker/${uuid}/${i}/test`} complete={phase.test.complete} />
          </TreeItem>

          <TreeItem title="Content" complete={phase.contentcomplete}>
            {phase.content.map((c, idx) => (
              <div key={idx}>
                <TreeItem title={"📘" + c.name} leaf={true} pathname={`/tracker/${uuid}/${i}/content/${idx}`} complete={c.complete} />

              </div>
            ))}
          </TreeItem>

          <TreeItem title="Practice" complete={phase.practicecomplete}>
            {phase.practice.map((p, idx) => (
              <div key={idx}>
                <TreeItem title={"✏️" + p.name} leaf={true} pathname={`/tracker/${uuid}/${i}/practice/${idx}`} complete={p.complete} />

              </div>
            ))}
          </TreeItem>
        </TreeItem>
      ))}
      <div>
      <div class="form-check form-switch">
        <label class="form-check-label text-light" for="flexSwitchCheckDefault">Edit</label>
        <input checked={isEditing} class="form-check-input" onChange={(e)=>{setIsEditing(e.target.checked)}} type="checkbox" id="flexSwitchCheckDefault"/>
      </div>
      </div>
    </div>
  );
}

export default function TrackerPage() {

  const { uuid } = useParams();
  const [items, setItems] = useState(null);
  const [target, setTarget] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const updateMap = async (uuid, items) => {
    try {
      // 假設這裡是你的 API
      await sendPost(`${process.env.REACT_APP_API_URL}/chat/map/${uuid}/phase`, items, () => { })
    } catch (error) {
      alert("API error:", error);
    } finally {
    }
  }

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // 假設這裡是你的 API
        const response = await fetch(`${process.env.REACT_APP_API_URL}/chat/map/${uuid}`,{credentials:"include"});
        if (response.status===401){ 
                  navigate('/login',{replace:true})
                }
        const data = await response.json();

        // 轉換成我們需要的格式
        const mapped = data.data.phase;
        setItems(mapped);
        setTarget(data.data.target);
      } catch (error) {
        console.error("API error:", error);
      } finally {
      }
    }
    fetchMenu();
  }, [uuid,navigate])
  return (
    <div className="d-flex  base">
      {/* 左側 Sidebar */}
      <Sidebar className="" mapped={items} uuid={uuid} target={target} isEditing={isEditing} setIsEditing={setIsEditing} />
      {items && <div className="container mt-3 mb-3 mr-3 " >
        <div className="mainContent container ">
          <Routes>
            <Route path=":i/test" element={<TestPage items={items} />} />
            <Route path=":i/content/:idx" element={<ContentPage items={items} />} />
            <Route path=":i/practice/:idx" element={<PracticePage items={items} />} />

          </Routes>
        </div>
      </div>}

      {/* 右側主內容 */}

    </div>

  );
  // 模擬不同頁面的內容
  function TestPage({ items }) {
    const { i, } = useParams();
    let data = items[i].test
    return <div>
      <CheckItem className="text-light"
        onToggle={async (state) => { data.complete = state; checkComplete(items); setItems([...items]); await updateMap(uuid, items); }} complete={data.complete} />
      <ContentCard src={data} isEditing={isEditing} updateMap={async () => { data = null; setItems(items); await updateMap(uuid, items) }} /></div>
  }

  function ContentPage({ items }) {
    const { i, idx } = useParams();

    let data = items[i].content[idx]
    return <div><CheckItem className="text-light"
      onToggle={async (state) => { data.complete = state; checkComplete(items); setItems([...items]); await updateMap(uuid, items); }} complete={data.complete}
    /><SourceCard data={data} isEditing={isEditing} 
    updateMap={async (index) => {
      data.source.splice(index, 1);await updateMap(uuid, items); setItems([...items]);
    }} 
    addSource={async (Form )=>{
      data.source.push(Form);await updateMap(uuid,items);setItems([...items]);
    }}/></div>
  }

  function PracticePage({ items }) {

    const { i, idx } = useParams();
    const data = items[i].practice[idx];
    return <div>
      <CheckItem className="text-light"
        onToggle={async (state) => { data.complete = state; checkComplete(items); setItems([...items]); await updateMap(uuid, items); }} complete={data.complete}
      /><ContentCard src={data} isEditing={isEditing} updateMap={async () => {setItems(items); await updateMap(uuid, items) }} /></div>

  }
  

}