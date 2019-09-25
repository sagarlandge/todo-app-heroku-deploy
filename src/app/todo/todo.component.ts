import { Component, OnInit } from '@angular/core';
import { TodoService } from './shared/todo.service';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers : [TodoService]
})
export class TodoComponent implements OnInit {
  toDoListArray : any[];
  constructor(private todoService : TodoService) { }

  ngOnInit() {
    this.todoService.getToDoList().snapshotChanges()
    .subscribe(item=>{
      this.toDoListArray = [];
      item.forEach(element => {
        var x = element.payload.toJSON();
        x["$key"] = element.key;
        this.toDoListArray.push(x);
      })

      this.toDoListArray.sort( (a : any,b : any)=>{
          return a.isChecked - b.isChecked;
      } )

    });
  }

  onAdd(itemTitle){
    console.log(itemTitle.value)
    this.todoService.addTitle(itemTitle.value);
    itemTitle.value = null;  
  }

  alterCheck($key : string, isChecked){
    this.todoService.checkOrUncheckTitle($key,!isChecked);
    if(isChecked == false){
      this.todoService.updateDate($key)
    }else{
      this.todoService.toDoList.update($key,{date:null})
    }
  }

  onDelete($key : string){
    this.todoService.removeTitle($key)
  }
}
