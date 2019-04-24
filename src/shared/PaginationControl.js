import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';


class PaginationControl extends React.Component {

    pageChanged = (page) => {
        console.debug(`Page changed to: ${page}`);
        if (this.props.pageChanged) {
            this.props.pageChanged(page);
        }
    }


    getPageCount = () => Math.ceil(this.props.totalCount / this.props.pageSize);

    getPagesToShow = () => {
        if (this.getPageCount() <= this.props.maxSize) {
            return Array.from({ length: this.getPageCount() }, (v, k) => k + 1);
        }

        const left = Math.ceil(this.props.maxSize / 2) - 1;
        const offset = Math.max(0, 1 - (this.props.currentPage - left)) + Math.min(0, this.getPageCount() - (this.props.currentPage + left + 1 - this.props.maxSize % 2));
        const start = this.props.currentPage - left;

        return Array.from({ length: this.props.maxSize }, (v, k) => k + start + offset);
    }


    render() {
        return (
            <Pagination>
                {this.props.maxSize < this.getPageCount() &&
                    <PaginationItem disabled={this.props.currentPage === 1}>
                        <PaginationLink href="" onClick={() => this.pageChanged(1)}>First</PaginationLink>
                    </PaginationItem>
                }
                <PaginationItem disabled={this.props.currentPage === 1}>
                    <PaginationLink href="" onClick={() => this.pageChanged(this.props.currentPage - 1)}>Previous</PaginationLink>
                </PaginationItem>

                {this.getPagesToShow().map(i =>
                    <PaginationItem key={i} active={this.props.currentPage === i}>
                        <PaginationLink href="" onClick={() => this.pageChanged(i)}>{i}</PaginationLink>
                    </PaginationItem>
                )}

                <PaginationItem disabled={this.props.currentPage === this.getPageCount()}>
                    <PaginationLink href="" onClick={() => this.pageChanged(this.props.currentPage + 1)}>Next</PaginationLink>
                </PaginationItem>
                {this.props.maxSize < this.getPageCount() &&
                    <PaginationItem disabled={this.props.currentPage === this.getPageCount()}>
                        <PaginationLink href="" onClick={() => this.pageChanged(this.getPageCount())}>Last</PaginationLink>
                    </PaginationItem>
                }
            </Pagination>

        )
    }
}

PaginationControl.defaultProps = {
    maxSize: 10
};

PaginationControl.propTypes = {
    totalCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageChanged: PropTypes.func,
    maxSize: PropTypes.number
};

export default PaginationControl;