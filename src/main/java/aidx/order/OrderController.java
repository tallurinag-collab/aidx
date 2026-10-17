package aidx.order;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private final Map<UUID, TravelOrder> orders = new ConcurrentHashMap<>();

    @PostMapping
    public ResponseEntity<TravelOrder> placeOrder(@RequestBody CreateOrderRequest request) {
        validate(request);

        var order = new TravelOrder(
                UUID.randomUUID(),
                request.travelerName().trim(),
                request.email().trim(),
                request.tripTitle().trim(),
                request.destination().trim(),
                request.startDate(),
                request.endDate(),
                request.travelerCount(),
                "RECEIVED");

        orders.put(order.id(), order);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping("/{id}")
    public TravelOrder getOrder(@PathVariable UUID id) {
        var order = orders.get(id);
        if (order == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        }
        return order;
    }

    private void validate(CreateOrderRequest request) {
        if (request == null
                || isBlank(request.travelerName())
                || request.travelerName().trim().length() > 120) {
            throw badRequest("Enter a traveler name up to 120 characters.");
        }
        if (isBlank(request.email()) || !EMAIL_PATTERN.matcher(request.email().trim()).matches()) {
            throw badRequest("Enter a valid email address.");
        }
        if (isBlank(request.tripTitle()) || isBlank(request.destination())) {
            throw badRequest("Trip title and destination are required.");
        }
        if (request.startDate() == null || request.endDate() == null
                || request.endDate().isBefore(request.startDate())) {
            throw badRequest("Enter valid travel dates. The return date must be on or after the departure date.");
        }
        if (request.travelerCount() == null || request.travelerCount() < 1 || request.travelerCount() > 12) {
            throw badRequest("Traveler count must be between 1 and 12.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    public record CreateOrderRequest(
            String travelerName,
            String email,
            String tripTitle,
            String destination,
            LocalDate startDate,
            LocalDate endDate,
            Integer travelerCount) {
    }

    public record TravelOrder(
            UUID id,
            String travelerName,
            String email,
            String tripTitle,
            String destination,
            LocalDate startDate,
            LocalDate endDate,
            Integer travelerCount,
            String status) {
    }
}
