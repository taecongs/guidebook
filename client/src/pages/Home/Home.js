import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import Pagination from 'react-js-pagination';
import './Home.css';


const Home = () => {
   // 가져온 데이터를 저장 할 배열 
    const [data, setData] = useState([]);

    const navigate = useNavigate();

    // 현재 페이지 번호를 라우트 매개변수에서 추출하고, 현재 페이지를 나타내는 변수로 활용
    const {pageNumber} = useParams();

    // 페이지 당 표시할 데이터 개수
    const itemsPerPage = 18;

    // 정수로 파싱, 기본값은 1페이지
    const currentPage = parseInt(pageNumber) || 1;

    // 데이터를 가져오고 있는지 파악하기 위해 정의
    const [loading, setLoading] = useState(true);

/*==================================================================================================
====================================================================================================*/

    // 서버 데이터 가져오기 위해 정의
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4001/guidebook');
                const jsonData = await response.json();

                const sortedData = jsonData.sort((a, b) => {
                    // 'No.' 이후의 숫자를 추출하여 비교 (숫자로 변환하여 비교)
                    const serialA = parseInt(a.serial.split('.')[1]);
                    const serialB = parseInt(b.serial.split('.')[1]);
                    return serialA - serialB;
                });

                setData(sortedData);
                setLoading(false);
            } catch (error) {
                console.error('데이터를 불러오는 중 오류 발생:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [pageNumber]);

    // 페이지가 렌더링 될 때마다 맨 위로 스크롤 위해 정의
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    // 브라우저 뒤로 가기 이벤트 처리를 위해 정의
    useEffect(() => {
        // 스크롤 위치를 먼저 최상단으로 이동시키고 페이지를 렌더링 한다. 
        const backwards = () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 0);
        };

        window.addEventListener('popstate', backwards);

        return () => {
            window.removeEventListener('popstate', backwards);
        };
    }, []);

    return(
        <section>
            <div className='main-container'>
                <div className='main-wrap'>
                    {loading ? (
                        <div className="main-loading-text">loading</div>
                    ) : (
                        <>
                            <div className='main-content'>
                                {data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
                                    <Link key={index} to={`/information/${item.serial}`} state={{pageNumber: pageNumber}} className='pokemon-col' >
                                        <div className='pokemon-data'>
                                            <div className='pokemon-image'>
                                                <img className='uploads-image' src={`/uploads/${item.serial}.png`} alt={item.name} />
                                            </div>
                                            <div className='pokemon-serial'>
                                                <p>{item.serial}</p>
                                            </div>
                                            <div className='pokemon-name'>
                                                <h2>{item.name}</h2>
                                            </div>
                                            <div className='pokemon-type'>
                                                <p style={{ backgroundColor: item.main_type_color }} className='pokemon-type1'>
                                                    {item.main_type_name}
                                                </p>
                                                <p style={{ backgroundColor: item.sub_type_color }} className='pokemon-type2'>
                                                    {item.sub_type_name}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Pagination
                                activePage={currentPage}            // 현재 활성화된 페이지 번호를 설정
                                itemsCountPerPage={itemsPerPage}    // 페이지당 표시할 항목 수를 설정
                                totalItemsCount={data.length}       // 전체 항목의 수를 설정
                                pageRangeDisplayed={5}              // 페이지 범위에 표시할 페이지 수를 설정
                                prevPageText={<span>&#x2039;</span>}
                                nextPageText={<span>&#x203A;</span>}
                                onChange={(pageNumber) => {
                                    // 페이지 번호가 1인 경우 메인페이지로 이동하고, 그렇지 않으면 해당 페이지로 이동
                                    navigate(pageNumber === 1 ? '/' : `/${pageNumber}`);
                                }}
                                itemClass="custom-page-item"
                            />
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Home;