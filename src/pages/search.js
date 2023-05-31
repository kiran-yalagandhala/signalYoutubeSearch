import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Search() {
    const [data, setData] = useState('');
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchCompleted, setIsSearchCompleted] = useState(false);
    const [downloadData, setDownloadData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [searchWord, setSearchWord] = useState('');

    const submitThis = (e) => {
        e.preventDefault();
        console.log(data);

        setIsSearching(true);

        axios
            .get(`http://172.174.177.153:3000/youtube/search-videos-by-query/${data}`)
            .then((response) => {
                console.log(response);
                setIsDataFetched(true);
                setIsSearchCompleted(true)
                setDownloadData(response.data);
                setSearchWord(data)
            })
            .catch((error) => {
                setIsDataFetched(false)
                setIsSearching(false)
                setIsSearchCompleted(false)
                console.log(error);
            })

        // Clear the input field after submission
        setData('');
    };

    const refreshSearch = () => {
        setIsSearchCompleted(false);
        setRefresh(true);
        setIsSearching(false)
    };

    useEffect(() => {
        if (refresh) {
            setIsDataFetched(false);
            setRefresh(false);
        }
    }, [refresh]);

    const downloadCSV = async () => {
        try {
            const response = await axios.get(`http://172.174.177.153:3000/youtube/get-videos-by-query/${searchWord}`);
            const setCSVData = await response.data.data.map((ele) => {
                delete ele.createdBy;
                delete ele.updatedBy;
                delete ele.createdAt;
                delete ele.id;
                delete ele.comments;
                ele.title = ele.title.replace(/\s+/g, ' ').replace(/[\r\n]+/g, '').trim();
                ele.title = `${ele.title}`;
                delete ele.description;
                delete ele.tags;
                console.log(ele.title);
                return ele;
            });

            console.log(setCSVData);

            const csvData = convertToCSV(setCSVData);
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'data.csv';
            link.click();
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const convertToCSV = (data) => {
        const headers = Object.keys(data[0]);
        const rows = data.map((obj) => headers.map((header) => obj[header]));
        const csvArray = [headers.join(','), ...rows.map((row) => row.join(','))];
        return csvArray.join('\n');
    };

    return (
        <div>
            <form onSubmit={submitThis}>
                <div>
                    <label htmlFor="data" style={styles.label}>
                        Enter Keyword
                    </label>
                    <input
                        type="text"
                        name="data"
                        id="data"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        style={styles.input}
                        placeholder={isSearchCompleted ? '' : 'Enter Keyword'}
                        disabled={isDataFetched} // Disab
                    />
                </div>
                {isSearchCompleted ? (
                    <div>
                        <button
                            type="button"
                            onClick={() => downloadCSV(searchWord)}
                            style={styles.button}
                        >
                            Download
                        </button>
                        <button type="button" onClick={refreshSearch} style={styles.button}>
                            Refresh
                        </button>
                    </div>
                ) : (
                    <button type="submit" disabled={isSearching} style={styles.button}>
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                )}
            </form>
        </div>
    );
}

const styles = {
    label: {
        display: 'none',
    },
    input: {
        padding: '8px',
        fontSize: '16px',
    },
    button: {
        margin: '8px',
        padding: '8px 16px',
        fontSize: '16px',
    },
};
