import {useEffect, useState} from 'react';
import { Blocks, Block } from './types/block';

const BlockView = () => {

    async function fetchData(): Promise<Blocks[]> {
        const response = await fetch('http://localhost:7071/api/block');
        const json: Block[] = await response.json();
        let collect: Blocks[] = [];
        json.forEach((item: Block) => {
            const ary = item['payload']['transactions']
            const urls = ary.map((item2: any) => {
                return "view/" + (item2);
            });
            collect.push({
                date: item['created'],
                block: item['payload']['number'].toString(),
                urls: urls
            });
        });
        console.log(collect);
        return collect; 
    }

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Blocks[]>([]); // Update the type of 'data' state variable
    useEffect(() => {
        fetchData().then((response) => {
            setData(response);
            setLoading(false);
        });
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h1>Blocks & Transactions</h1>
                    {data.map((item, index) =>
                        <div key={index}>
                            {item.date} {item.block}
                            <ol>
                                {item.urls.map((d, idx) => <li key={idx}><a href={d}>{d.split('/')[1]}</a></li>)}
                            </ol>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

};

export default BlockView;
