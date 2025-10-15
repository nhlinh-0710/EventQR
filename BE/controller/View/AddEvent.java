package View;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class AddEvent {

	private List<Event> eventList;
	private Scanner sc;

	public AddEvent() {
		this.eventList = new ArrayList<>();
		this.sc = new Scanner(System.in);
	}

	public void input() {
		System.out.println("====== Thêm Sự Kiện Mới =====");

		System.out.println("Nhập tên sự kiện của bạn: ");
		String name = sc.nextLine();

		int checkOutTime = 0;
		boolean validTime = false;

		while (!validTime) {
			System.out.println("Hãy nhập giờ checkout (ví dụ: 1700): ");
			if (sc.hasNextInt()) {
				checkOutTime = sc.nextInt();
				validTime = true;
			} else {
				System.out.println("Bạn đã nhập sai định dạng vui lòng nhập lại (Ví dụ: 1700)");
				sc.next();
			}
		}
		
		int checkInTime = 0;
		validTime = false;
		
		while(!validTime) {
			System.out.println("Hãy nhập giờ checkin: ");
			if(sc.hasNextInt()) {
				checkInTime = sc.nextInt();
				validTime = true;
			}else {
				System.out.println("Bạn đã nhập sai định dạng vui lòng nhập lại (Ví dụ: 1700)");
				sc.next();
			}
		}
		
		int quantity = 0;
		validTime = false;
		
		while(!validTime) {
			System.out.println("Hãy nhập số lượng người tham gia: ");
			if(sc.hasNextInt()) {
				quantity = sc.nextInt();
				validTime = true;
			}else {
				System.out.println("Bạn đã nhập sai định dạng vui lòng nhập lại (Ví dụ: 1700)");
				sc.next();
			}
		}
		sc.nextLine();
		
		Event newEvent = new Event(name, checkOutTime, checkInTime,quantity);
		eventList.add(newEvent);
		
		System.out.println("Event đã được thêm thành công");
		System.out.println(newEvent);
		
	}
	public List<Event> getAllEvent(){
		return eventList;
	}

}
