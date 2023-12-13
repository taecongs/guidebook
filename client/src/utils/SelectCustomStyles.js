export const SelectCustomStyles = {
    control: (provided, state) => ({
        ...provided,
        border: '1px solid ' + (state.isFocused ? '#4a90e2' : '#bbb'),
        borderRadius: '0px',
        boxShadow: 'none',
        minHeight: '47.78px',
        padding: '0px',
    }),
    option: (provided, state) => ({
        ...provided,
        padding: '15px',
        cursor: 'pointer',
    }),
    menu: (provided) => ({
        ...provided,
        '& > div': {
            padding: '0px',
            // maxHeight: '250px',
            // overflowY: 'auto',
            '&::-webkit-scrollbar': {
                width: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#4a90e2',
                borderRadius: '0px',
            },
        },
        borderRadius: '0px',
        margin: '0px',
    }),
}