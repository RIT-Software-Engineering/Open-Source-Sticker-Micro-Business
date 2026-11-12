package gold_star.sticker_business.entities.Repos;

import gold_star.sticker_business.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepo extends JpaRepository<Order, Integer> {}
