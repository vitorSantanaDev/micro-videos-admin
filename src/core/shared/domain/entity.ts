import { Notification } from "./validators/notification";
import { ValueObject } from "./value-objects";

export abstract class Entity {
  notification: Notification = new Notification();

  abstract get entity_id(): ValueObject;
  abstract toJSON(): any;
}
