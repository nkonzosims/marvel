import { Component } from '@angular/core';
import {CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Character, Profile } from './character.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  profile: Profile;

  constructor(private http: HttpClient) {

  }

  characters = [
  ];

  character = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log('move item in array');
    } else {
      
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
                        
    }

    let draggedCharacter = this.character[event.currentIndex];
    
    if(this.character.length > 1) {
      this.character.pop();
    } 

    this.getProfile(draggedCharacter.id)

  }
  noReturnPredicate() {
    return false;
  }
  existancePredicate(item: CdkDrag<any>) {
    return true
  }

  getCharacters() {
    this.http.get('api/marvel/characters').subscribe((success: Array<Character>)=> {
      success.forEach((character) => {
        this.characters.push(character)
      });
    }, (error) => {
      console.error('failed to return data from server angular', error);
      
    })
  }

  getProfile(id: string) {
    let params = new HttpParams()
    .set('id', id);
    this.http.get('api/marvel/character/profile', {params: params}).subscribe((profile: Profile) => {
      this.profile = profile
    }, (error) => {
      console.log('error on profile ', error)
    });
  }
}
