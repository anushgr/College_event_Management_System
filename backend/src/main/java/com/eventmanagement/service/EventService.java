package com.eventmanagement.service;

import com.eventmanagement.dto.EventRequest;
import com.eventmanagement.model.Event;
import com.eventmanagement.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAllByOrderByDateAsc();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    public Event createEvent(EventRequest request, String createdBy) {
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDate(request.getDate());
        event.setLocation(request.getLocation());
        event.setDescription(request.getDescription());
        event.setCreatedBy(createdBy);
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, EventRequest request) {
        Event event = getEventById(id);
        event.setTitle(request.getTitle());
        event.setDate(request.getDate());
        event.setLocation(request.getLocation());
        event.setDescription(request.getDescription());
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }
}
