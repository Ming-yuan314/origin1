import styled from '@emotion/styled'
import {ReactComponent as PagiLeftSvg} from 'static/img/pagi_left.svg'
import {ReactComponent as PagiRightSvg} from 'static/img/pagi_right.svg'

interface PaginatorProps {
    totalPages: number
    current: number
    onChange: (v: number) => void
    loading: boolean
}

const Paginator: React.FC<PaginatorProps> = ({totalPages, current, onChange, loading}) => {
    const handleNext = () => {
        if (loading || current === totalPages) {
            return
        }
        onChange(current + 1)
    }
    const handlePrev = () => {
        if (loading || current === 1) {
            return
        }
        onChange(current - 1)
    }
    return (
        <PaginatorWrapper>
            <NavButton onClick={handlePrev} disabled={loading || current === 1}>
                <PagiLeftSvg />
            </NavButton>
            <span>Page</span>
            <PageNumWrap>
                <PageNum>{current}</PageNum>
            </PageNumWrap>
            <span className="right">of {totalPages}</span>
            <NavButton onClick={handleNext} disabled={loading || current === totalPages}>
                <PagiRightSvg />
            </NavButton>
        </PaginatorWrapper>
    )
}

export default Paginator

const PaginatorWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    span {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 13px;
        color: #767c8e;
        margin-left: 16px;
        margin-right: 4px;

        &.right {
            margin-right: 16px;
            margin-left: 4px;
        }
    }
`

const PageNumWrap = styled.div`
    height: 30px;
    border-radius: 4px;
    background: #3c4350;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    opacity: 0.8;
`
const PageNum = styled.div`
    width: 42px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 4px;
    background: none;
    border: none;
    outline: none;
    color: #fff;
    text-align: left;
    padding-left: 10px;
`

const NavButton = styled.div<{disabled: boolean}>`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    width: 56px;
    height: 30px;
    border-radius: 4px;
    background: ${(props) => (props.disabled ? '#262931' : '#3C4350')};
    opacity: ${(props) => (props.disabled ? '1' : '0.8')};

    &:hover {
        opacity: 1;
    }

    > svg {
        path {
            fill: ${(props) => (props.disabled ? '#828387' : '#fff')};
        }
    }
`
