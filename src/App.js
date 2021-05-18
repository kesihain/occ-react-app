import logo from './logo.svg';
import { Form, FormGroup, Label, Input, Container, Table, Button } from 'reactstrap';
import axios from "axios";
import { useState, useEffect } from 'react';
import LoadingIndicator from './LoadingIndicator';
import NumberFormat from 'react-number-format';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [orderData, setOrderData] = useState([])
  const [formData, setFormData] = useState({
    totalPaid: '',
    totalAmount: ''
  })

  const changeAmount = (event) => {
    setFormData(prev => {
      prev.totalAmount = event.target.value
      return prev
    })
  }
  const changePaid = (event) => {
    setFormData(prev => {
      prev.totalPaid = event.target.value
      return prev
    })
  }
  const apiRoot = 'http://localhost:3001'


  const handleSubmit = (event) => {
    event.preventDefault()
    if (!formData.totalAmount || !formData.totalPaid) {
      console.log('in')
      toast.error('Please key in values in both fields', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    }else{
      setFormData({
        totalAmount: '',
        totalPaid: ''
      })
      axios({
        method: "POST",
        url: `${apiRoot}/new`,
        params: {
          totalAmount: formData.totalAmount,
          totalPaid: formData.totalPaid
        }
      }).then(result => {
        if (result.data) {
          success()
          setFormData({ totalAmount: '', totalPaid: '' })
          axios({
            method: "GET",
            url: `${apiRoot}/show`
          }).then(result => {
            setIsLoading(false)
            setOrderData(result.data)
          })
        }
      })
    }
  }

  const success = ()=> toast.success('Order added successfully', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });


  useEffect(() => {
    axios({
      method: "GET",
      url: `${apiRoot}/show`
    }).then(result => {
      setIsLoading(false)
      setOrderData(result.data)
    })
  }, [])

  if (isLoading) {
    return <LoadingIndicator></LoadingIndicator>
  }

  return (
    <div className="App">
      <Container className="mt-3">
        <ToastContainer />
        <Form onSubmit={(event) => handleSubmit(event)}>
          <FormGroup>
            <Label for="totalAmount">Total Amount</Label>
            <NumberFormat thousandSeparator={true} prefix={'RM'} className="form-control" name="totalAmount" id="totalAmount" value={formData.totalAmount} onChange={(event) => changeAmount(event)}></NumberFormat>
          </FormGroup>
          <FormGroup>
            <Label for="totalPaid">Total Paid</Label>
            <NumberFormat thousandSeparator={true} prefix={'RM'} className="form-control" name="totalPaid" id="totalPaid" value={formData.totalPaid} onChange={(event) => changePaid(event)}></NumberFormat>
          </FormGroup>
          <Button type="submit" value="Submit">Submit</Button>
        </Form>
      </Container>
      <Container className="mt-3">
        <Table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Total Amount</th>
              <th>Total Paid</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {
              orderData.map(item => (
                <tr key={item.id}>
                  <th scope="row">{item.orderNumber}</th>
                  <td>{item.totalAmount}</td>
                  <td>{item.totalPaid}</td>
                  <td>{item.createdDate}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default App;
