import { Unsubscribe } from 'firebase/firestore';

class SubscriptionManager {
  private subscriptions: Map<string, Unsubscribe> = new Map();
  private isCleaningUp: boolean = false;

  addSubscription(id: string, unsubscribe: Unsubscribe) {
    if (this.isCleaningUp) return;
    
    // Clean up existing subscription before adding new one
    this.cleanupSubscription(id);
    this.subscriptions.set(id, unsubscribe);
  }

  cleanupSubscription(id: string) {
    const existing = this.subscriptions.get(id);
    if (existing) {
      try {
        existing();
      } catch (error) {
        console.error(`Error cleaning up subscription ${id}:`, error);
      }
      this.subscriptions.delete(id);
    }
  }

  cleanupAll() {
    this.isCleaningUp = true;
    this.subscriptions.forEach((unsubscribe, id) => {
      try {
        unsubscribe();
      } catch (error) {
        console.error(`Error cleaning up subscription ${id}:`, error);
      }
    });
    this.subscriptions.clear();
    this.isCleaningUp = false;
  }
}

export const subscriptionManager = new SubscriptionManager();