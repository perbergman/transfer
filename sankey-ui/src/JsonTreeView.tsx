import React, {useState} from 'react';

// @ts-ignore
const JsonTreeView = ({data}) => {
    const [isOpen, setIsOpen] = useState(true);
    if (typeof data !== 'object' || data === null) {
        return <div>{String(data)}</div>;
    }

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div style={{marginLeft: '20px'}}>
            {Array.isArray(data) ? (
                <div>
          <span onClick={handleClick} style={{cursor: 'pointer'}}>
            {isOpen ? '[-]' : '[+]'} Array[{data.length}]
          </span>
                    {isOpen && (
                        <div >
                            {data.map((item, index) => (
                                <div  key={index}>
                                    [{index}]:<JsonTreeView data={item}/>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
          <span onClick={handleClick} style={{cursor: 'pointer'}}>
            {isOpen ? '[-]' : '[+]'} Object </span> {isOpen && (
                    <div > {Object.keys(data).map((key) => (
                        <div key={key}> <b>{key}</b>:<JsonTreeView data={data[key]}/></div>
                    ))}
                    </div>
                )}
                </div>
            )}
        </div>
    );
};

export default JsonTreeView;
