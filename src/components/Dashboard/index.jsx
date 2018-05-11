import React, { Component } from "react";
import "./Dashboard.css";
import {
  XAxis,
  YAxis,
  Bar,
  BarChart,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  // LineChart,
  // Line
} from "recharts";
import RadioGroup from '../Common/RadioGroup';

const data = [
  { name: "jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "may", uv: 1890, pv: 4800, amt: 2181 },
  { name: "jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "jul", uv: 3490, pv: 4300, amt: 2100 }
];
const data1=[{
  name: "invoice", unpaid: 37, overdue: 13, paid: 50
}];
export default class DashBoard extends Component {
  render() {
    return (
      <div style={{ width: "100%" }}>
      <div className="MessageBox" >dashboard is real. numbers are not.</div>
        <div className="dashboard">
          <div
            style={{
              width: "95%",
              height: "auto",
              margin: "auto",
              marginBottom: "10px",
              fontVariant: "small-caps",
              paddingBottom: "5px"
            }}
          >
            <div className="row" style={{ height: "100px" }}>
              <div
                className="col-md-4"
                style={{ background: "white", paddingTop: "15px" }}
              >
                <div className="revenue">&#x20b9;182.54k</div>
                <span className="revenueDescription">
                  monthly recurring revenue
                </span>
              </div>
              <div className="col-md-8">
                <div className="row" style={{ height: "100px" }}>
                  <div
                    className="col"
                    style={{
                      marginLeft: "2px",
                      background: "white",
                      paddingTop: "15px"
                    }}
                  >
                    <div className="revenue">&#x20b9;56.2k</div>
                    <span
                      className="revenueDescription"
                      style={{ color: "grey" }}
                    >
                      december
                    </span>
                  </div>
                  <div
                    className="col"
                    style={{
                      marginLeft: "2px",
                      background: "white",
                      paddingTop: "15px"
                    }}
                  >
                    <div className="revenue">&#x20b9;23.8k</div>
                    <span
                      className="revenueDescription"
                      style={{ color: "grey" }}
                    >
                      november
                    </span>
                  </div>
                  <div
                    className="col"
                    style={{
                      marginLeft: "2px",
                      background: "white",
                      paddingTop: "15px"
                    }}
                  >
                    <div className="revenue">&#x20b9;12.2k</div>
                    <span
                      className="revenueDescription"
                      style={{ color: "grey" }}
                    >
                      october
                    </span>
                  </div>
                  <div
                    className="col"
                    style={{
                      marginLeft: "2px",
                      background: "white",
                      paddingTop: "15px"
                    }}
                  >
                    <div className="revenue">&#x20b9;29.1k</div>
                    <span
                      className="revenueDescription"
                      style={{ color: "grey" }}
                    >
                      september
                    </span>
                  </div>
                  <div
                    className="col"
                    style={{
                      marginLeft: "2px",
                      background: "white",
                      paddingTop: "15px"
                    }}
                  >
                    <div className="revenue">&#x20b9;11.9k</div>
                    <span
                      className="revenueDescription"
                      style={{ color: "grey" }}
                    >
                      august
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              width: "95%",
              height: "130px",
              margin: "auto",
              marginBottom: "10px",
              fontVariant: "small-caps"
            }}
          >
            <div className="row" style={{ height: "100px" }}>
              <div className="col-md-4" style={{ marginRight: "10px" }}>
                <font style={{ color: "rgb(173, 32, 41)", fontWeight: "bold" }}>
                  players
                </font>
                <div className="row" style={{ height: "100px" }}>
                  <div
                    className="col"
                    style={{
                      marginLeft: "2px",
                      background: "white",
                      paddingTop: "15px"
                    }}
                  >
                    <div className="revenue">182</div>
                    <span
                      className="revenueDescription"
                      style={{ color: "grey" }}
                    >
                      active
                    </span>
                  </div>
                  <div
                    className="col"
                    style={{
                      marginLeft: "2px",
                      background: "white",
                      paddingTop: "15px"
                    }}
                  >
                    <div className="revenue">32</div>
                    <span
                      className="revenueDescription"
                      style={{ color: "grey" }}
                    >
                      inactive
                    </span>
                  </div>
                  <div
                    className="col"
                    style={{
                      marginLeft: "2px",
                      background: "white",
                      paddingTop: "15px"
                    }}
                  >
                    <div className="revenue">13</div>
                    <span
                      className="revenueDescription"
                      style={{ color: "grey" }}
                    >
                      new
                    </span>
                  </div>
                </div>
              </div>
              <div className="col">
                <font style={{ color: "rgb(173, 32, 41)", fontWeight: "bold" }}>
                  payments
                </font>
                <div className="row" style={{ height: "100px" }}>
                  <div
                    className="col"
                    style={{
                      marginLeft: "2px",
                      background: "white",
                      paddingTop: "15px"
                    }}
                  >
                    <div className="revenue">&#x20b9;182.54k</div>
                    <span
                      className="revenueDescription"
                      style={{ color: "grey" }}
                    >
                      monthly recurring revenue
                    </span>
                  </div>
                  <div
                    className="col"
                    style={{
                      marginLeft: "2px",
                      background: "white",
                      paddingTop: "15px"
                    }}
                  >
                    <div className="revenue">&#x20b9;21.28k</div>
                    <span
                      className="revenueDescription"
                      style={{ color: "grey" }}
                    >
                      due invoices
                    </span>
                  </div>
                  <div
                    className="col"
                    style={{
                      marginLeft: "2px",
                      background: "white",
                      paddingTop: "15px"
                    }}
                  >
                    <div className="row">
                      <div className="col">
                        <div className="revenue">&#x20b9;543k</div>
                        <span
                          className="revenueDescription"
                          style={{ color: "grey" }}
                        >
                          net revenue
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              width: "95%",
              height: "300px",
              margin: "auto",
              marginBottom: "10px",
              fontVariant: "small-caps"
            }}
          >
            <div className="row" style={{ height: "300px" }}>
              <div
                className="col-md-4"
                style={{ background: "white", marginRight: "11px" }}
              >
                <div className='row'>
                <div className="col"> 

                <font style={{ color: "rgb(173, 32, 41)", fontWeight: "bold" }}>
                  invoices
                </font>
                </div>
                <div className="col-md-5">
                <font style={{ fontVariant:'normal' }}>
                   <font style={{ color: "orange"}}> &#x20b9;127k</font> / 182k
                    </font>
                </div>
                </div>
                <div className='row' style={{marginBottom:'2px'}}>
                  <BarChart width={window.screen.width / 4} height={40} data={data1} layout="vertical" barSize={13}
                    margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                    <defs>
                      <linearGradient id="colorOverdue" x1="0" y1="1" x2="1" y2="1">
                        <stop offset="2%" stopColor="red" stopOpacity={0.5}/>
                        <stop offset="98%" stopColor="red" stopOpacity={1.0}/>
                      </linearGradient>
                      <linearGradient id="colorUnpaid" x1="0" y1="1" x2="1" y2="1">
                        <stop offset="2%" stopColor="orange" stopOpacity={0.5}/>
                        <stop offset="98%" stopColor="orange" stopOpacity={1.0}/>
                      </linearGradient>
                      <linearGradient id="colorPaid" x1="0" y1="1" x2="1" y2="1">
                        <stop offset="2%" stopColor="green" stopOpacity={0.5}/>
                        <stop offset="98%" stopColor="green" stopOpacity={1.0}/>
                      </linearGradient>
                    </defs>
                  <XAxis type="number" hide/>
                  <YAxis type="category" dataKey="name" hide/>
                  <Bar dataKey="overdue" stackId="a" fill="url(#colorOverdue)" label={{ fill: 'white', fontSize: 10 ,textAnchor:'right'}} />
                  <Bar dataKey="unpaid" stackId="a" fill="url(#colorUnpaid)"label={{ fill: 'white', fontSize: 10,textAnchor:'right' }} />
                  <Bar dataKey="paid" stackId="a" fill="url(#colorPaid)" label={{ fill: 'white', fontSize: 10,textAnchor:'right' }} />
                </BarChart>
                </div>
                <div className="row">
                  <div className="col-md-9">
                  <RadioGroup data={{ U: 'unpaid', O: 'overdue', P: 'paid'}} 
                selected={'unpaid'}
                // onSelect={(arr, key) => this.setState({ player: Object.assign({}, this.state.player, { gender: key }) }) }
                />
                </div>
                <div className="col-md-3">
                <font style={{ color: "rgb(173, 32, 41)",fontSize:'10px',fontVariant:'normal',textAlign:'right'}}
                    >
                  More &rsaquo;&rsaquo;
                    </font>
                </div>
              </div>
              <div className="row">
                  <table
                    className="table table-light table-hover"
                    style={{ margin: "0", fontSize: "13px",fontVariant:'normal' }}
                  >
                    <tbody>
                      <tr>
                        <td>inv0215</td>
                        <td>xxxxx</td>
                        <td>-43days</td>
                        <td>&#x20b9;2750</td>
                        <td>pay now</td>
                      </tr>
                      <tr>
                        <td>inv0216</td>
                        <td>xxxxx</td>
                        <td>-21days</td>
                        <td>&#x20b9;2000</td>
                        <td>pay now</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col" style={{ background: "white",paddingBottom:'10px' }}>
                <div className="row">
                  <div className="col-md-6">
                    <font
                      style={{ color: "rgb(173, 32, 41)", fontWeight: "bold" }}
                    >
                      revenue
                    </font>
                  </div>
                  <div className="col" >
                     <RadioGroup data={{ D: 'day', W: 'week', M: 'month', Y:'year' }} selected={'D'} />
                  </div>
                </div>
                <div className="row">
                  <AreaChart width={window.screen.width / 2} height={250} data={data} >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="pv" fill='red' stroke="red" strokeWidth="2" dot={{ stroke: 'red', strokeWidth: 2 }} />
                  </AreaChart>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              width: "95%",
              height: "300px",
              margin: "auto",
              marginBottom: "10px",
              fontVariant: "small-caps"
            }}
          >
            <div className="row" style={{ background: "white" }}>
              <div className="col-md-8">
                <font
                  style={{
                    color: "rgb(173, 32, 41)",
                    fontWeight: "bold",
                    paddingTop: "3px"
                  }}
                >
                  monthly recurring revenue
                </font>
              </div>
              <div className="col">
              <RadioGroup data={{ D: 'day', W: 'week', M: 'month', Y:'year' }} 
              selected={'day'}
              // onSelect={(arr, key) => this.setState({ player: Object.assign({}, this.state.player, { gender: key }) }) }
              />
              </div>
            </div>
            <div className="row" style={{ background: "white" }}>
              <AreaChart width={window.screen.width - 300} height={250} data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area dataKey="pv" fill="orange" stroke="orange" strokeWidth="2" dot={{ stroke: 'orange', strokeWidth: 2 }}  />
              </AreaChart>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
