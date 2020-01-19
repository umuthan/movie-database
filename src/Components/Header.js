/**
 * Movie Database - Header Component
 * https://github.com/umuthan/movie-database
 *
 * Author: Umuthan Uyan
 *
 */

import React, { Component } from 'react';

import { getCategories } from '../Api/Movies';

class Header extends Component {

  constructor(props) {

    super(props);

    this.state = {
      categoriesData: [],
      checkedCategories: [],
      categorySelection: false
    };

  }

  componentDidMount() {

    let categoryFilter = [];
    // Get filtered categories and assign to checkbox
    if(this.props.category) this.props.category.split(',').map((category) => categoryFilter.push(category));

    // Get all the categories from API
    getCategories().then( data => {
      this.setState({
        categoriesData: data,
        checkedCategories: categoryFilter
      });
    });

  }

  onChangeCategories = (e) => {

    // current array of checked categories
    const categories = this.state.checkedCategories
    let index

    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the value of the checkbox to options array
      categories.push(e.target.value)
    } else {
      // or remove the value from the unchecked checkbox from the array
      index = categories.indexOf(e.target.value)
      categories.splice(index, 1)
    }

    // update the state with the new array of options
    this.setState({ checkedCategories: categories })

  }

  handleSubmit = (e) => {

    // Do nothing after form submit
    e.preventDefault();

    // Get Title from input
    const title = e.target.title.value;

    // Get categories from checkboxes
    let categories = '';
    this.state.checkedCategories.map((category,i) => categories += category+',');
    categories = categories.substr(0,categories.length-1);

    // Get runtime from inputs
    let runTime;
    if(e.target.runTime.value > 0) runTime = e.target.runTimeOperator.value+e.target.runTime.value;

    // Change url for filtered options
    this.props.changeUrlCallback(1,title,categories,runTime);

  }

  toggleCategorySelection = (e) => {

    e.preventDefault();

    // Set current selection
    this.setState({
      categorySelection: !this.state.categorySelection
    })

  }

  render() {

    const {
      title,
      runTime
    } = this.props;

    const {
      categoriesData,
      checkedCategories,
      categorySelection
    } = this.state;

    return(

      <header id="head">
        <div id="logo">
          <img alt="Movie Database" src={require('../Assets/img/logo.png')} />
        </div>
        <div id="filterOptions">
          <form onSubmit={this.handleSubmit}>
            <h2>Filter Options</h2>
            <div className={categorySelection ? 'hidden' : 'visible'}>
              <h3>Movie Title</h3>
              <label>
                <input placeholder="Enter your title here..." id="title" type="text" name="title" defaultValue={title} />
              </label>
            </div>
            { categorySelection ? (
              <>
              <h3>Select Categories</h3>
              <div id="selectMore" className="categories">
                { categoriesData.map((category, i)=>(
                  <label key={i} className={checkedCategories.indexOf(category.name) >= 0 ? "category checked" : "category"}>
                    {category.name}
                    <input type="checkbox" checked={checkedCategories.indexOf(category.name) >= 0 && 'checked'} name="category" onChange={this.onChangeCategories} value={category.name} />
                  </label>
                ))
                }
                <button type="button" className="category button" onClick={this.toggleCategorySelection}>Done</button>
              </div>
              </>
            ) : (
              <>
              <h3>Categories</h3>
              <div id="selected" className="categories">
                { checkedCategories.map((category,i) => (
                  <label key={i} className="category checked">
                    {category}
                  </label>
                  ))
                }
                { checkedCategories.length > 0 ? (
                  <button type="button" className="category button" onClick={this.toggleCategorySelection}>Select More</button>
                ) : (
                  <button type="button" className="category button center" onClick={this.toggleCategorySelection}>Select Categories</button>
                )}
              </div>
              </>
            ) }
            <div className={categorySelection ? 'hidden' : 'visible'}>
              <h3>Run Time</h3>
              <label id="runTime">
                <select name="runTimeOperator">
                  <option value=">=">Grater Than or Equal</option>
                  <option value="<=">Less Than or Equal</option>
                </select>
                <div id="runTimeInput">
                  <input type="number" min="0" name="runTime" defaultValue={runTime && runTime.split('=')[1]} placeholder="Enter Run Time" />
                  <span>min.</span>
                </div>
              </label>
            </div>
            <input className={categorySelection ? 'hidden' : 'visible'} type="submit" value="FILTER" />
          </form>
        </div>
      </header>

    )

  }

}

export default Header;
