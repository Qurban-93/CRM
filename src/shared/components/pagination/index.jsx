import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import "./index.scss";

export function Pagination({ pageCount, paginationFor }) {

    const { page } = useParams();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);


    const pages = [];

    for (let i = 1; i <= pageCount; i++) {
        if (i == page) {
            pages.push(<li key={i} className='current-page'>{i}</li>)
        } else {
            pages.push(<li key={i}><Link to={`/${paginationFor}/${i}`}>{i}</Link></li>)
        }
    }


    return (
        <>
            <div className="pagination">
                <ul>
                    {pages}
                </ul>
            </div>
        </>
    )
}
