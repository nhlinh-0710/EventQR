package View;

public class Event {

	public String name;
	public int checkOutTime;
	public int checkInTime;
	public int quantity;
	
	public Event() {
	}

	public Event(String name, int checkOutTime, int checkInTime, int quantity) {
		this.name = name;
		this.checkOutTime = checkOutTime;
		this.checkInTime = checkInTime;
		this.quantity = quantity;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getCheckOutTime() {
		return checkOutTime;
	}

	public void setCheckOutTime(int checkOutTime) {
		this.checkOutTime = checkOutTime;
	}

	public int getCheckInTime() {
		return checkInTime;
	}

	public void setCheckInTime(int checkInTime) {
		this.checkInTime = checkInTime;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	@Override
	public String toString() {
		return "Event [name=" + name + ", checkOutTime=" + checkOutTime + ", checkInTime=" + checkInTime + ", quantity="
				+ quantity + "]";
	}
	
	
	
	
}
