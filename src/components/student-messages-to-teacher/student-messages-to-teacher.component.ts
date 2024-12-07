import { Component, OnInit } from '@angular/core';
import { MessageServiceTeacherService } from '../../service/message-service-teacher.service';
import { AuthService } from '../../service/auth-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-messages-to-teacher',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './student-messages-to-teacher.component.html',
  styleUrls: ['./student-messages-to-teacher.component.scss'],
})
export class StudentMessagesToTeacherComponent implements OnInit {
  studentId: string = '';
  messages: any[] = [];
  teachers: any[] = [];
  newMessage: string = '';
  selectedTeacherId: string = '';

  constructor(private messageService: MessageServiceTeacherService, private authService: AuthService) {}

  ngOnInit(): void {
    this.studentId = this.authService.getStudentId();
    if (this.studentId) {
      this.loadTeachers();
      this.loadMessages();
    } else {
      alert('Student ID not found. Please log in again.');
    }
  }

  loadTeachers() {
    this.messageService.getTeachersForStudent(this.studentId).subscribe({
      next: (response) => {
        this.teachers = response;
      },
      error: (error) => {
        console.error('Error fetching teachers:', error);
        alert('Failed to load teachers.');
      },
    });
  }

  loadMessages() {
    this.messageService.getMessagesForStudent(this.studentId).subscribe({
      next: (response) => {
        this.messages = response;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        alert('Failed to load messages.');
      },
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedTeacherId) {
      alert('Message and teacher selection are required.');
      return;
    }
  
    const message = {
      message: this.newMessage.trim(),
    };
  
    this.messageService.sendMessageToTeacher(this.studentId, this.selectedTeacherId, message).subscribe({
      next: (response) => {
        alert('Message sent successfully!');
        console.log('Response:', response);
        this.newMessage = '';
        this.loadMessages();
      },
      error: (error) => {
        console.error('Error sending message:', error);
        alert('Failed to send message.');
      },
    });
  }
  
}
