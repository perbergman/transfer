import {useEffect, useState} from 'react';
import './App.css';
import JsonTreeView from './JsonTreeView';
import {useParams} from "react-router-dom";
import {OneBlock} from "./types/transaction";

async function fetchData(id: string | undefined) : Promise<OneBlock> {
    const response = await fetch('http://localhost:7071/api/transaction/' + id);
    return await response.json();
}

const TxView = () => {
    let { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({} as OneBlock);

    useEffect(() => {
        fetchData(id).then((response) => {
            setData(response);
            setLoading(false);
        });
    }, [id]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div><h1>Transaction View</h1>
                    <JsonTreeView data={data} />
                </div>
            )}
        </div>
    );
};
export default TxView;



