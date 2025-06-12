package ir.mrmoein.quezapplication.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.Future;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class JwtRefreshToken extends BaseEntity<UUID> {

    private String username;

    private Instant createdAt;

    @Future(message = "The expiration date should now be after this !!!")
    private Instant expiresAt;

    private Boolean revoked;

    @PrePersist
    private void persist() {
        this.createdAt = Instant.now();
        this.expiresAt = Instant.now().plusSeconds(60 * 60 * 24 * 7);
        this.revoked = Boolean.FALSE;
    }
}
