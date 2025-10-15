package Main;

import View.AddEvent;
import View.EditEvent;
import View.Event;

public class main {

	public static void main(String[] args) {
		AddEvent eventManager = new AddEvent();
		
		eventManager.input();
		
		eventManager.input();
		
		System.out.println("Danh sách các sự kiện: ");
		for(Event event : eventManager.getAllEvent() ) {
			System.out.println(event);
		}
	
	 EditEvent edit = new EditEvent(eventManager.getAllEvent());
     edit.edit();

	 System.out.println("\nDanh sách các sự kiện sau khi sửa:"); 
     for(Event event : eventManager.getAllEvent() ) {
         System.out.println(event);
     }
	}
}
