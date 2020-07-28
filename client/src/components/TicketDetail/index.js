import React, { Component } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import TicketEdit from "../TicketEdit";

import {
  IronButton,
  ironBlue,
  ironPurple,
  ironRed,
  lightBlue,
  lightGray,
  evenLighterGray,
} from "../../styles/global.js";

// import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Card, Avatar, Input, Typography } from "antd";

import x from "../../files/x.svg";

// const client = new W3CWebSocket('ws://localhost:5555');
// const { Text } = Typography;
// const { Search } = Input;
// const { Meta } = Card;

const fadeIn = keyframes`
 0% { opacity: 0 }
 70% { opacity: 0   }
 100% { opacity: 1 }
`;

const slideUp = keyframes`
 0% { transform: translateY(1000px); opacity: 0; }
 50% { opacity: 0.2; }
 100% { transform: translateY(0); opacity: 1; }
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  animation: ${fadeIn} 0.4s ease-in-out;
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  border-radius: 10px;
  background-color: white;
  width: 350px;
  height: 450px;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
  animation: ${slideUp} 2s ease-in-out;
`;

const FormContainer = styled.div`
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Close = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 5px;
  right: 5px;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  cursor: pointer;
`;

const X = styled.img`
  width: 40px;
`;

const Paragraph = styled.p`
  display: block;
`;

export default class TicketDetail extends Component {

  assignTeacher = () => {
    axios
      .put(`/api/tickets/${this.props.match.params.id}`, {
        status: "In progress",
      })
      .then((response) => {
        // console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    // console.log('I am here', this.props.ticketDetail)
    // console.log("ITSSSSS" + this.props.ticketDetail);
    if (!this.props.ticketDetail) return <></>;
    return (
      <MainContainer>
        <Container>
          <Close
            onClick={() => {
              this.props.showTicketDetail(false);
            }}
          >
            <X src={x} alt="Close" />
          </Close>
          <FormContainer>

            <Paragraph> {this.props.ticketDetail.title}</Paragraph>
            <Paragraph>
              Created By: {this.props.ticketDetail.createdBy.name}
            </Paragraph>

            <Paragraph> Lab: {this.props.ticketDetail.lab}</Paragraph>
            <Paragraph> Title: {this.props.ticketDetail.title}</Paragraph>
            <Paragraph>
              Problem: {this.props.ticketDetail.description}
            </Paragraph>
            <Paragraph> Status: {this.props.ticketDetail.status}</Paragraph>
            <Paragraph>
              Assignee:{" "}
              {this.props.ticketDetail.assignee &&
                this.props.ticketDetail.assignee.name}
            </Paragraph>

            <TicketEdit
              ticketDetail={this.props.ticketDetail}
            />

            <IronButton onClick={this.assignTeacher}>
              Take this ticket
            </IronButton>
          </FormContainer>
        </Container>
      </MainContainer>
    );
  }
}
