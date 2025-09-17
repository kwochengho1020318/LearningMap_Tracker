import React, { useEffect, useState, } from "react";
import {  useParams, } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.js";
import "./Tracker.css";
import "./Edit.css"
import { EditableCard ,SourceCard, ContentCard} from "./utils.js";


export default function EditPage() {
    const { uuid } = useParams();
    const [map, setMap] = useState(null);
    useEffect(() => {
        const fetchMap = async () => {
            try {
                // 假設這裡是你的 API
                const response = await fetch(`${process.env.REACT_APP_API_URL}/chat/map/${uuid}` );
                const data = await response.json();

                // 轉換成我們需要的格式
                setMap(data.data);
            } catch (error) {
                console.error("API 錯誤:", error);
            } finally {
            }
        }
        fetchMap();
    }, [uuid])
    function schedule(map){
        let count=0;
        let queue = []
        for(let index in map.phase){
            for(let contentIndex in map.phase[index].content){
                queue[count]={phase:Number(index),index:Number(contentIndex),type:"內容"};
                count++;
            }
            for(let practiceIndex in map.phase[index].practice){
                queue[count]={phase:Number(index),index:Number(practiceIndex),type:"練習"};
                count++;
            }
            queue[count]={phase:Number(index),type:"測驗"};
            count++;
        }
        return queue;
    }
    function PhaseEditor({ map, setMap }) {
        
        const [queue,setQueue]=useState([])
        const [current,setCurrent]=useState(0);
        const [data,setData]=useState({})
        
        useEffect(()=>{
            setQueue(schedule(map));
        },[map]);

        if(!map||queue.length<=0)return;
        const currentPhaseIndex = queue[current].phase;
        const currentPhase = map.phase[currentPhaseIndex];
        const currentIndex = queue[current].index;
        const currentObject =queue[current].type==="內容"?map.phase[currentPhaseIndex].content[currentIndex] :queue[current].type==="練習"?currentPhase.practice[currentIndex]:currentPhase.test;
        
        return (
            <div className="flex-column">
                {map &&queue.length>0&& <div>
                {current===queue.length-1&&<div><span>恭喜你完成啦</span><br/></div>}
                <span>階段{currentPhaseIndex+1}:{currentPhase.name}</span><br/>
                <span>{queue[current].type}{currentIndex?currentIndex+1:""}:{currentObject.name}</span>
                {data&&queue[current].type==="內容"?<SourceCard data={currentObject}/>: <ContentCard  src={currentObject}/>}
                </div>
                }
                <div className="nav-buttons ">
                        <button class="btn btn-info prev text-light " onClick={()=>{if( current>0) setCurrent(current-1);}}>← 上一步</button>
                        <button class="btn btn-info next text-light " onClick={()=>{if (current<queue.length-1){setCurrent(current+1);setData({})}}}>下一步 →</button>
                    </div>
            </div>
        );
    }
    return (
        <div className=" App-header d-flex  base">
            {map && <div className="mainContent mt-3 mb-3" >
                <div className="">

                </div>
                <div className="flex-column ">
                    <EditableCard map={map} setMap={setMap} />
                    <PhaseEditor map={map} setMap={setMap} />
                    
                </div>
            </div>}

        </div>

    );
}