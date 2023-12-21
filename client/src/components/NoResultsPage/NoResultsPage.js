import './NoResultsPage.css';

export const NoResultsPage = () => {
    return(
        <div className="no-results-message">
            <h2 className='nrm-h2'>검색 결과가 없습니다.</h2>
            <p className='nrm-p'>다른 키워드로 검색해주세요.</p>
        </div>
    )
}