import { FormEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom(){
  const history = useHistory();
  const {user} = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  
  const { questions, title } = useRoom(roomId);  

  async function handleDeleteQuestion(questionId: string){
    if(window.confirm('Tem certeza que voce deseja exluir?')){
      const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/');
  }

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />

          <div>
            <RoomCode code={roomId} />
            <Button 
              isOutlined
              onClick={handleEndRoom}
            >
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length === 1 && <span> {questions.length} pergunta</span> }
          { questions.length > 1 && <span> {questions.length} perguntas</span> }
        </div>

        
        
        <div className="questions-list">
          {questions.map(question => {
            return (
              <Question 
                key= {question.id}
                content = {question.content}
                author = {question.author}
                isHighlighted = {question.isHighlighted}
                isAnswered = {question.isAnswered}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Excluir" />
                </button>
              </Question>
            )
          })}
        </div>
        

      </main>
    </div>
  )
}