import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams} from "react-router-dom";
import { useRecoilState } from 'recoil';
import Pagination from 'react-js-pagination';
import { pokemonState, searchTextState, noResultsState } from '../../atom/pokemonState';
import { NoResultsPage } from '../../components/NoResultsPage/NoResultsPage';
import { Search } from '../../components/Search/Search';
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

    // 검색어를 저장하기 위해 정의
    const [searchText, setSearchText] = useRecoilState(searchTextState);

    // 검색 결과를 저장하기 위해 정의
    const [filteredData, setFilteredData] = useRecoilState(pokemonState);

    // 검색 결과가 없는 경우를 관리하기 위해 정의
    const [noResults, setNoResults] = useRecoilState(noResultsState);

    // 선택한 타입 정보 저장하기 위해 정의
    const [selectedTypes, setSelectedTypes] = useState([]);

/*==================================================================================================
====================================================================================================*/

    // 검색어 입력 시 상태 업데이트
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    // 검색 버튼 클릭 또는 엔터 시 실행
    const handleSearch = () => {
        // 검색어를 입력하지 않았을 때는 전체 데이터를 사용하고, 검색어를 입력하면 검색어에 따라 데이터 필터링
        const filteredResults = searchText ? data.filter((item) => (
                item.name.toLowerCase().includes(searchText.toLowerCase()) || item.detail.toLowerCase().includes(searchText.toLowerCase())
        )) : [];

        // 필터링된 결과를 상태에 저장
        setFilteredData(filteredResults);

        // 검색 결과가 있을 때만 페이지로 이동
        if (filteredResults.length > 0) {
            // 검색어를 입력했는데 검색 결과가 있는 경우 -> '/search/1'로 이동
            navigate('/search/1');

            // 결과가 있는 경우에는 false
            setNoResults(false);
            
        } else if (searchText) {
            // 검색어를 입력했는데 검색 결과가 없는 경우 -> '/search/noResults'로 이동
            navigate('/search/noResults');
            
            // 결과가 없는 경우에는 true
            setNoResults(true);
        } else {
            // 아무런 값을 작성하지 않은 경우 -> 메인페이지로 이동
            // navigate('/');
            window.location.href = '/';
        }
    };

    // 포켓몬 타입 선택시 실행
    const handleTypeSelection = (type_id, type_name) => {
        // 선택된 타입이 이미 존재하는지 확인
        const useSelectedTypes = selectedTypes.findIndex(type => type.type_id === type_id);
        
        // 이미 선택된 타입이라면, 해당 타입의 선택을 해제
        if(useSelectedTypes !== -1){
            setSelectedTypes(prevTypes => prevTypes.filter(type => type.type_id !== type_id));
        } else{
            // 이미 선택 된 타입이 아니라면, 해당 타입을 선택 목록에 추가
            setSelectedTypes(prevTypes => [...prevTypes, {type_id, type_name}]);
        }
    }

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

                // console.log(sortedData);

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
        // 스크롤 위치를 먼저 최상단으로 이동시키고 페이지를 렌더링
        const backwards = () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
                setFilteredData([]);
                setSearchText('');
                setNoResults(false);
            }, 0);
        };

        window.addEventListener('popstate', backwards);

        return () => {
            window.removeEventListener('popstate', backwards);
        };
    }, [setFilteredData, setSearchText, setNoResults]);

    return(
        <section>
            <div className='main-container'>
                {/* 검색 */}
                <Search
                    searchText={searchText}
                    handleSearchChange={handleSearchChange}
                    handleSearch={handleSearch}
                    handleTypeSelection={handleTypeSelection}
                    selectedTypes={selectedTypes}
                />

                {/* 포켓몬 데이터 */}
                <div className='main-wrap'>
                    {loading ? (
                            <div className="main-loading-text">loading</div>
                    ) : (
                            <div className='main-content'>
                                {noResults ? (
                                    // 검색 결과가 없을 때의 메시지를 표시
                                    <NoResultsPage />
                                ) : (
                                    // 검색 결과가 있거나 전체 데이터를 표시
                                    filteredData.length > 0 ? (
                                        filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
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
                                        ))
                                    ) : (
                                        data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
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
                                        ))
                                    )
                                )}
                            </div>
                        )}

                        {noResults ? null : (
                            <Pagination
                                // 현재 활성화된 페이지 번호를 설정
                                activePage={currentPage}

                                // 페이지당 표시할 항목 수를 설정
                                itemsCountPerPage={itemsPerPage}  
                                
                                // 현재 표시되는 데이터의 전체 항목 수 설정 
                                // 만약 필터링 된 데이터가 있을 경우, 필터링된 데이터의 길이를 사용
                                // 필터링 된 데이터가 없을 경우, 원본 데이터의 길이를 사용
                                totalItemsCount={filteredData.length > 0 ? filteredData.length : data.length} 

                                // 페이지 범위에 표시할 페이지 수를 설정
                                pageRangeDisplayed={5} 
                                prevPageText={<span>&#x2039;</span>}
                                nextPageText={<span>&#x203A;</span>}
                                onChange={(pageNumber) => {
                                    // 만약 필터링된 데이터가 있으면 '/search/'를 포함한 URL을 설정하고, 없으면 '/'를 포함한 URL을 설정, 그리고 페이지 번호가 1인 경우 메인페이지로 이동
                                    const targetPage = filteredData.length > 0 ? `/search/${pageNumber}` : pageNumber === 1 ? '/' : `/${pageNumber}`;
                                    navigate(targetPage);
                                }}
                            />
                        )}
                </div>
            </div>
        </section>
    )
}

export default Home;