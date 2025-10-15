package View;

import java.util.List;
import java.util.Scanner;

public class EditEvent {
	
		private List<Event> eventList;
	    private Scanner sc;
	    
	    
	    public EditEvent(List<Event> eventList) {
	    	this.eventList = eventList;
	    	this.sc = new Scanner(System.in);
		}
	    
	    private void displayEvent() {
	    	System.out.println("-----Sự kiện hiện có: ------");
	    	for(int i = 0; i<eventList.size(); i++) {
	    		System.out.println(eventList);
	    	}
	    }
	    
	    public void edit() {
	    	System.out.println("===Chỉnh Sửa Sự Kiện===");
	    	
	    	displayEvent();
	    	
	    	if(eventList.isEmpty()) {
	    		return;
	    	}
	    	
	    	System.out.println("Nhập tên Event cần chỉnh sửa: ");
	    	String nameToEdit = sc.nextLine();
	    	
	    	Event eventToEdit = null;
	    	for(Event event : eventList) {
	    		if(event.getName().equalsIgnoreCase(nameToEdit)) {
	    			eventToEdit = event;
	    			break;
	    		}
	    	}
	    	
	    	if(eventToEdit == null) {
	    	 System.out.println("Lỗi không tìm thấy sự kiện");
	    	 return;
	    	}
	    	
	    	System.out.println("\nĐang chỉnh sửa Event: " + eventToEdit.getName());
	    	System.out.println("Vui lòng nhập lại toàn bộ thông tin mới:");
	    	
	    	System.out.print("Nhập Tên MỚI: ");
	        String newName = sc.nextLine();
	        eventToEdit.setName(newName);
	        
	        int newCheckOutTime = 0;
	        boolean validTime = false;
	        while (!validTime) {
	            System.out.print("Hãy nhập giờ checkout MỚI (ví dụ: 1700): ");
	            if (sc.hasNextInt()) {
	                newCheckOutTime = sc.nextInt();
	                validTime = true;
	            } else {
	                System.out.println("Bạn đã nhập sai định dạng vui lòng nhập lại (Ví dụ: 1700)");
	                sc.next();
	            }
	        }
	        eventToEdit.setCheckOutTime(newCheckOutTime);
	        
	        int newCheckInTime = 0;
	        validTime = false;
	        while(!validTime) {
	            System.out.print("Hãy nhập giờ checkin MỚI: ");
	            if(sc.hasNextInt()) {
	                newCheckInTime = sc.nextInt();
	                validTime = true;
	            }else {
	                System.out.println("Bạn đã nhập sai định dạng vui lòng nhập lại (Ví dụ: 1700)");
	                sc.next();
	            }
	        }
	        eventToEdit.setCheckInTime(newCheckInTime);
	        
	        int newQuantity = 0;
	        validTime = false;
	        while(!validTime) {
	            System.out.print("Hãy nhập số lượng người tham gia MỚI: ");
	            if(sc.hasNextInt()) {
	                newQuantity = sc.nextInt();
	                validTime = true;
	            }else {
	                System.out.println("Bạn đã nhập sai định dạng vui lòng nhập lại (Ví dụ: 1700)");
	                sc.next();
	            }
	        }
	        eventToEdit.setQuantity(newQuantity);
	        
	        sc.nextLine(); 
	        
	        System.out.println(" Event đã được CẬP NHẬT thành công!");
	        System.out.println("Thông tin mới: " + eventToEdit);
	    }


}
